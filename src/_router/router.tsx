import { createRouter } from "@tanstack/solid-router";

import { appRoutes } from "../routes";
import { mediaRoutes } from "../category/_routes";
import { categoryRouteTree } from "../category/_routeTree";
import { startRouteTransition } from "../_components/transitions/viewTransition";
import { RouterContext, rootRoute } from "./rootRoute";
import { toRoutes } from "./routeTree";
import { parseSearch, stringifySearch } from "./search";

/*
   The areas not yet on typed routes, converted from their _routes.ts.

   In the tree, but kept out of its type. Their paths are strings decided at
   runtime, typed as "any route" - and one of those in the tree widens every
   path the router knows to plain `string`, which quietly switches off checking
   for the typed areas too. Nothing needs them typed: they are reached by path
   strings through the compatibility layer, exactly as before.
*/
const untypedRoutes = toRoutes(
    rootRoute,
    appRoutes.filter(route => route !== mediaRoutes)
) as unknown as [];

// every area on typed routes is left out of the conversion above and added as its own subtree
const routeTree = rootRoute.addChildren([categoryRouteTree, ...untypedRoutes]);

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
