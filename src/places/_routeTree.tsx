import { createRoute, lazyRouteComponent } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { validatePlacesSearch } from "./_search";
import { prefetch } from "../_router/prefetch";
import { isUuid } from "../_models/Uuid";
import {
    placeQueryOptions,
    placesQueryOptions,
    prefetchPlaceChain
} from "../_contexts/api/_placesQueries";

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
    /*
       The level's listing, under whatever search or kind is on, and - below the
       root - the place itself and the chain above it. The edit mode changes
       nothing that is read, so it is not a reason to read again.
    */
    loaderDeps: ({ search }) => ({ q: search.q, kind: search.kind }),
    loader: ({ context, params, deps }) =>
        prefetch(context, async (queryClient, getToken) => {
            const id = isUuid(params.placeId) ? params.placeId : undefined;

            await Promise.all([
                queryClient.prefetchQuery(
                    placesQueryOptions(getToken, {
                        parentId: id,
                        kind: deps.kind,
                        search: deps.q ?? ""
                    })
                ),
                ...(id
                    ? [
                          queryClient.prefetchQuery(placeQueryOptions(getToken, id)),
                          prefetchPlaceChain(queryClient, getToken, id)
                      ]
                    : [])
            ]);
        }),
    component: lazyRouteComponent(() => import("./Browse"))
});
