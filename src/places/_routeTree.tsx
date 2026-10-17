import { createRoute, lazyRouteComponent } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { validatePlacesSearch } from "./_routes";

/*
   The place tree, a level at a time. The place being looked at lives in the path
   rather than in a signal, so a link to one level can be shared and reloaded.
   Optional: with nothing there the page lists the countries, the root of the
   tree. Browsing needs nothing beyond being signed in - the API scopes every
   listing to what the caller can see.

   The media taken at a place is the shared feed, under /places/{id}/media -
   declared in _media/feed/_routeTree.tsx.
*/
export const placesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "places/{-$placeId}",
    beforeLoad: requireLogin,
    validateSearch: validatePlacesSearch,
    component: lazyRouteComponent(() => import("./Browse"))
});
