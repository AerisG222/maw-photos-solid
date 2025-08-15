import { createContext, createResource, ParentComponent, Show, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { createAuth0Client, User } from "@auth0/auth0-spa-js";

export type AuthState = {
    readonly isLoggedIn: boolean;
    readonly user: User | undefined;
};

const defaultAuth: AuthState = {
    isLoggedIn: false,
    user: undefined
};

export type AuthContextValue = [
    state: AuthState,
    actions: {
        login: () => Promise<void>;
        logout: () => void;
        isAdmin: () => boolean;
        getToken: () => Promise<string | undefined>;
    }
];

const AuthContext = createContext<AuthContextValue>();

// inspiration: https://github.com/rturnq/solid-auth0/blob/master/src/components.tsx
export const AuthProvider: ParentComponent = props => {
    const redirectUrl = `${window.location.origin}`;
    const [state, setState] = createStore(defaultAuth);

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
        var client = await createAuth0Client({
            domain: import.meta.env.VITE_AUTH0_DOMAIN,
            clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
            authorizationParams: authParams
        });

        const url = window.location.href;

        if (isRedirect(url)) {
            const response = await client.handleRedirectCallback(url);
            window.history.replaceState(undefined, "", redirectUrl);
        }

        setState({ isLoggedIn: await client.isAuthenticated() });

        if (state.isLoggedIn) {
            // https://steven-giesel.com/blogPost/caa09b13-83e4-452e-899f-598c66181e63
            // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/message_event
            // https://www.clurgo.com/en/blog/service-worker-and-static-content-authorization
            navigator.serviceWorker.addEventListener("message", async event => {
                if (event.data === "requestToken") {
                    const token = await client.getTokenSilently();
                    event.ports[0].postMessage(token);
                }
            });

            setState({ user: await client.getUser() });
        }

        return client;
    });

    const login = async () => {
        try {
            await auth0Client()!.loginWithRedirect({
                authorizationParams: authParams
            });
        } catch (err) {
            console.error(err);
        }
    };
    const logout = () => {};
    const isAdmin = () => false;
    const getToken = async () => await auth0Client()?.getTokenSilently();

    return (
        <Show when={auth0Client()}>
            <AuthContext.Provider
                value={[
                    state,
                    {
                        login,
                        logout,
                        isAdmin,
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
