import { createRoute, lazyRouteComponent } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";

/*
   The people and clans picker. A person's and a clan's media hang under
   /people too, so the nav entry stays lit while browsing either - but they are
   the shared feeds, declared in _media/feed/_routeTree.tsx.
*/
export const peopleRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "people",
    beforeLoad: requireLogin
});

const peopleGridRoute = createRoute({
    getParentRoute: () => peopleRoute,
    path: "/",
    component: lazyRouteComponent(() => import("./Grid"))
});

export const peopleRouteTree = peopleRoute.addChildren([peopleGridRoute]);
