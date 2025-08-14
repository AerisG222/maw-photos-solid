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
        login: () => Promise<boolean>;
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

    const [auth0Client] = createResource(async () => {
        var client = await createAuth0Client({
            domain: import.meta.env.VITE_AUTH0_DOMAIN,
            clientId: import.meta.env.VITE_AUTH0_CLIENT_ID
        });

        const url = window.location.href;

        if (isRedirect(url)) {
            const response = await client.handleRedirectCallback(url);
            window.history.replaceState(undefined, "", redirectUrl);
        }

        setState({ isLoggedIn: await client.isAuthenticated() });

        if (state.isLoggedIn) {
            setState({ user: await client.getUser() });
        }

        return client;
    });

    const login = async () => {
        try {
            await auth0Client()!.loginWithRedirect({
                authorizationParams: {
                    redirect_uri: redirectUrl
                }
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
