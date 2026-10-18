import { createRoute, lazyRouteComponent } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { prefetch } from "../_router/prefetch";
import { peopleQueryOptions } from "../_contexts/api/_peopleQueries";
import { clansQueryOptions } from "../_contexts/api/_clansQueries";

/*
   The people and clans picker. A person's and a clan's media hang under
   /people too, so the nav entry stays lit while browsing either - but they are
   the shared feeds, declared in _media/feed/_routeTree.tsx.
*/
export const peopleRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "people",
    beforeLoad: requireLogin,
    loader: ({ context }) =>
        prefetch(context, (queryClient, getToken) =>
            Promise.all([
                queryClient.prefetchQuery(peopleQueryOptions(getToken)),
                queryClient.prefetchQuery(clansQueryOptions(getToken))
            ])
        )
});

const peopleGridRoute = createRoute({
    getParentRoute: () => peopleRoute,
    path: "/",
    component: lazyRouteComponent(() => import("./Grid"))
});

export const peopleRouteTree = peopleRoute.addChildren([peopleGridRoute]);
