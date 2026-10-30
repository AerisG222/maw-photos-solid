import { createRouter, Outlet } from "@tanstack/solid-router";

import { RouterContext, rootRoute } from "./rootRoute";
import { routeTree } from "./routeTree";
import { parseSearch, stringifySearch } from "./search";
import { installNavigationLoopBreaker } from "./loopBreaker";

import AppContext from "../_components/app-context/AppContext";
import App from "../App";

/*
   The application shell, as the root route's component - attached here rather
   than declared with the root route, which every other route imports. See
   rootRoute.tsx.
*/
rootRoute.update({
    component: () => (
        <AppContext>
            <App>
                <Outlet />
            </App>
        </AppContext>
    )
});

export const createAppRouter = (context: RouterContext) => {
    const router = createRouter({
        routeTree,
        context,
        parseSearch,
        stringifySearch,
        // start a route's loader on hover or focus, so its data is on the way before the click
        defaultPreload: "intent",
        /*
           Run the loader on every preload and leave freshness to the query
           cache. A loader here only starts queries, and the cache already knows
           how long each answer stays good - a second opinion held by the router
           would only skip preloads the cache would have answered for free.
        */
        defaultPreloadStaleTime: 0
    });

    // a loop reported rather than a frozen tab - see loopBreaker.ts
    if (import.meta.env.DEV) {
        installNavigationLoopBreaker(router);
    }

    return router;
};

declare module "@tanstack/solid-router" {
    interface Register {
        router: ReturnType<typeof createAppRouter>;
    }
}
