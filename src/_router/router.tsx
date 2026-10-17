import { createRouter } from "@tanstack/solid-router";

import { categoryRouteTree } from "../category/_routeTree";
import { authRouteTree } from "../auth/_routeTree";
import { aboutRouteTree } from "../about/_routeTree";
import { settingsRouteTree } from "../settings/_routeTree";
import { searchRouteTree } from "../search/_routeTree";
import { statsRouteTree } from "../stats/_routeTree";
import { categoriesRouteTree } from "../categories/_routeTree";
import { randomRouteTree } from "../random/_routeTree";
import { peopleRouteTree } from "../people/_routeTree";
import { placesRoute } from "../places/_routeTree";
import { feedRouteTrees } from "../_media/feed/_routeTree";
import { catchAllRoute } from "../redirect/_routeTree";
import { startRouteTransition } from "../_components/transitions/viewTransition";
import { RouterContext, rootRoute } from "./rootRoute";
import { parseSearch, stringifySearch } from "./search";

/*
   Every area, each declared in its own _routeTree.tsx. Order does not decide
   which route an address reaches - TanStack ranks them by how specific their
   paths are - except that the catch-all goes last, for whoever reads it.
*/
const routeTree = rootRoute.addChildren([
    authRouteTree,
    aboutRouteTree,
    settingsRouteTree,
    searchRouteTree,
    statsRouteTree,
    categoriesRouteTree,
    randomRouteTree,
    peopleRouteTree,
    placesRoute,
    ...feedRouteTrees,
    categoryRouteTree,
    catchAllRoute
]);

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
        defaultPreloadStaleTime: 0,
        defaultViewTransition: true
    });

    router.startViewTransition = startRouteTransition;

    return router;
};

declare module "@tanstack/solid-router" {
    interface Register {
        router: ReturnType<typeof createAppRouter>;
    }
}
