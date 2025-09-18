import {
    createContext,
    createResource,
    onCleanup,
    onMount,
    ParentComponent,
    Show,
    useContext
} from "solid-js";
import { createStore } from "solid-js/store";
import { createAuth0Client, User } from "@auth0/auth0-spa-js";
import { useNavigate } from "@solidjs/router";

import { loginPage, logout as logoutPage } from "../auth/_routes";

export interface AuthState {
    readonly isLoggedIn: boolean;
    readonly isAdmin: boolean;
    readonly user: User | undefined;
}

const defaultAuth: AuthState = {
    isLoggedIn: false,
    isAdmin: false,
    user: undefined
};

export type AuthContextValue = [
    state: AuthState,
    actions: {
        login: (returnUrl: string | undefined) => Promise<void>;
        logout: (returnUrl: string | undefined) => Promise<void>;
        setIsAdmin: (isAdmin: boolean) => void;
        getToken: () => Promise<string | undefined>;
    }
];

const AuthContext = createContext<AuthContextValue>();

// inspiration: https://github.com/rturnq/solid-auth0/blob/master/src/components.tsx
export const AuthProvider: ParentComponent = props => {
    const navigate = useNavigate();
    const redirectUrl = `${window.location.origin}`;
    const [state, setState] = createStore(defaultAuth);

    let swMessageHandler: (ev: MessageEvent) => Promise<void>;

    const scopes = [
        "openid",
        "email",
        "profile",
        "offline_access",
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/media:read`,
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/media:write`,
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/comments:read`,
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/comments:write`,
        `${import.meta.env.VITE_AUTH0_AUDIENCE}/stats:read`
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

            window.history.replaceState(undefined, "", redirectUrl);

            const returnTo = response.appState?.returnTo as string | undefined;

            if (returnTo && returnTo !== loginPage.absolutePath) {
                navigate(returnTo);
            } else {
                navigate("/");
            }
        }

        setState({ isLoggedIn: await client.isAuthenticated() });
        setState({ user: await client.getUser() });

        return client;
    });

    const login = async (returnUrl: string | undefined) => {
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

    const logout = async (returnUrl: string | undefined) => {
        const destAfterLogout = returnUrl ?? `${window.location.origin}${logoutPage.absolutePath}`;

        await auth0Client()?.logout({
            clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
            logoutParams: { returnTo: destAfterLogout }
        });
    };

    const setIsAdmin = (isAdmin: boolean) => setState({ isAdmin });

    const getToken = async () => await auth0Client()?.getTokenSilently();

    onMount(() => {
        // https://steven-giesel.com/blogPost/caa09b13-83e4-452e-899f-598c66181e63
        // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/message_event
        // https://www.clurgo.com/en/blog/service-worker-and-static-content-authorization
        if (navigator.serviceWorker) {
            swMessageHandler = async (ev: MessageEvent) => {
                const data = ev.data;

                if (data === "REQUEST_TOKEN" && ev.ports?.[0]) {
                    try {
                        const token = await getToken();
                        ev.ports[0].postMessage(token);
                    } catch (err) {
                        console.error("AuthContext: failed to get token for SW", err);
                        ev.ports[0].postMessage(undefined);
                    }
                }
            };

            navigator.serviceWorker.addEventListener("message", swMessageHandler);

            if (!navigator.serviceWorker.controller) {
                setTimeout(() => {
                    if (!navigator.serviceWorker.controller) {
                        console.warn("serviceworker not detected - forcing reload");
                        window.location.reload();
                    }
                }, 300);
            }
        }
    });

    onCleanup(() => {
        if (navigator.serviceWorker && swMessageHandler) {
            navigator.serviceWorker.removeEventListener("message", swMessageHandler);
        }
    });

    return (
        <Show when={auth0Client()}>
            <AuthContext.Provider
                value={[
                    state,
                    {
                        login,
                        logout,
                        setIsAdmin,
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
