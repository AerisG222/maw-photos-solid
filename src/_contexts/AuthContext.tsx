import {
    createContext,
    createResource,
    onCleanup,
    ParentComponent,
    Show,
    useContext
} from "solid-js";
import { createStore } from "solid-js/store";
import { createAuth0Client, User } from "@auth0/auth0-spa-js";

import { LOGIN_PATH, LOGOUT_PATH } from "../auth/_routeTree";
import { AccountStatus } from "../_models/AccountStatus";
import { createAssetSession as createAssetSessionCookie, deleteAssetSession } from "./api/_shared";
import { AssetSession, createAssetSession } from "./assetSession";

export interface AuthState {
    readonly isLoggedIn: boolean;
    readonly accountStatus: AccountStatus | undefined;
    readonly user: User | undefined;
}

const defaultAuth: AuthState = {
    isLoggedIn: false,
    accountStatus: undefined,
    user: undefined
};

export type AuthContextValue = [
    state: AuthState,
    actions: {
        login: (returnUrl?: string) => Promise<void>;
        logout: (returnUrl?: string) => Promise<void>;
        setAccountStatus: (accountStatus: AccountStatus) => void;
        getToken: () => Promise<string | undefined>;
    }
];

const AuthContext = createContext<AuthContextValue>();

// inspiration: https://github.com/rturnq/solid-auth0/blob/master/src/components.tsx
export const AuthProvider: ParentComponent = props => {
    const redirectUrl = `${window.location.origin}`;
    const [state, setState] = createStore(defaultAuth);

    let assetSession: AssetSession | undefined;

    const scopes = [
        "openid",
        "email",
        "profile",
        "offline_access",
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/media:read`,
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/media:write`,
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/comments:read`,
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/comments:write`,
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/stats:read`,
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/face-recognition:read`,
        // administering places: choosing the photograph that represents one, and
        // correcting a tree the geocoder derived. Reading places needs nothing
        // beyond media:read, so a caller without this simply cannot write
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/location:write`
    ];

    const authParams = {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: redirectUrl,
        scope: scopes.join(" ")
    };

    const [auth0Client] = createResource(async () => {
        const client = await createAuth0Client({
            domain: import.meta.env.VITE_AUTH0_DOMAIN,
            clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
            authorizationParams: authParams
        });

        const url = window.location.href;

        if (isRedirect(url)) {
            const response = await client.handleRedirectCallback(url);
            const returnTo = (response.appState as { returnTo?: string } | undefined)?.returnTo;

            /*
               Written straight to the address bar rather than navigated to:
               this provider sits above the router, which is only made once
               sign-in has settled - see index.tsx - and starts from wherever
               the address bar then says.
            */
            window.history.replaceState(
                undefined,
                "",
                returnTo && returnTo !== LOGIN_PATH ? returnTo : "/"
            );
        }

        const isLoggedIn = await client.isAuthenticated();

        /*
           Before the client is handed over, because this provider renders nothing
           until then: the first images the app asks for need the cookie to be there.
        */
        if (isLoggedIn) {
            assetSession = createAssetSession({
                getToken: fresh =>
                    client.getTokenSilently(fresh ? { cacheMode: "off" } : undefined),
                createSession: createAssetSessionCookie,
                onSessionEnded: () =>
                    void login(`${window.location.pathname}${window.location.search}`)
            });

            await assetSession.start();
        }

        setState({ isLoggedIn });
        setState({ user: await client.getUser() });

        return client;
    });

    const login = async (returnUrl?: string) => {
        const destAfterLogin = returnUrl ?? window.location.pathname;

        try {
            await auth0Client()!.loginWithRedirect({
                authorizationParams: authParams,
                appState: { returnTo: destAfterLogin }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const logout = async (returnUrl?: string) => {
        const destAfterLogout = returnUrl ?? `${window.location.origin}${LOGOUT_PATH}`;

        await assetSession?.stop();

        // best effort: signing out must not depend on the api, and the cookie expires
        await deleteAssetSession().catch((err: unknown) => console.error(err));

        await auth0Client()?.logout({
            clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
            logoutParams: { returnTo: destAfterLogout }
        });
    };

    const setAccountStatus = (accountStatus: AccountStatus) => setState({ accountStatus });

    const getToken = async () => await auth0Client()?.getTokenSilently();

    onCleanup(() => void assetSession?.stop());

    return (
        <Show when={auth0Client()}>
            <AuthContext.Provider
                value={[
                    state,
                    {
                        login,
                        logout,
                        setAccountStatus,
                        getToken
                    }
                ]}
            >
                {props.children}
            </AuthContext.Provider>
        </Show>
    );
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("Auth context not provided by ancestor component!");
};

function isRedirect(url: string) {
    const [, query] = url.split("?");
    return query && query.includes("code=") && query.includes("state=");
}
