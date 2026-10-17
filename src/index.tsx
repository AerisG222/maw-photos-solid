import { render } from "solid-js/web";
import { QueryClientProvider } from "@tanstack/solid-query";
import { RouterProvider } from "@tanstack/solid-router";

import { AuthProvider, useAuthContext } from "./_contexts/AuthContext";
import { createAppQueryClient } from "./_contexts/api/queryClient";
import { createAppRouter } from "./_router/router";

import AppErrorBoundary from "./_components/error/AppErrorBoundary";

// self-hosted webfonts - no render-blocking request to fonts.googleapis.com
import "@fontsource-variable/nunito-sans";
import "@fontsource/tangerine/400.css";

import "./index.css";

const queryClient = createAppQueryClient();

/*
   Made inside AuthProvider, which renders nothing until sign-in has settled -
   so the router starts from the address sign-in left behind, and its loaders
   and guards can ask for a token from the very first navigation.
*/
const AppRouter = () => {
    const [auth, { getToken, login }] = useAuthContext();
    const router = createAppRouter({
        queryClient,
        getToken,
        isLoggedIn: () => auth.isLoggedIn,
        login
    });

    return <RouterProvider router={router} />;
};

render(
    () => (
        // outermost net: the page-level boundary lives inside the provider tree,
        // so it cannot catch a provider itself failing to initialize
        <AppErrorBoundary title="MaW Photos could not start">
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <AppRouter />
                </QueryClientProvider>
            </AuthProvider>
        </AppErrorBoundary>
    ),
    document.getElementById("root")!
);
