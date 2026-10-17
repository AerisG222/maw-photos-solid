import { QueryClient } from "@tanstack/solid-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/solid-router";

import { GetToken } from "../_contexts/api/_routeQueries";

import AppContext from "../_components/app-context/AppContext";
import App from "../App";

/*
   What a route's loader and guards are handed. Both live above the router -
   see index.tsx - so they exist before any screen does, which is the point:
   a loader can start a screen's queries, and a guard can turn somebody away,
   before that screen's code has even arrived.
*/
export interface RouterContext {
    queryClient: QueryClient;
    getToken: GetToken;
    isLoggedIn: () => boolean;
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <AppContext>
            <App>
                <Outlet />
            </App>
        </AppContext>
    )
});
