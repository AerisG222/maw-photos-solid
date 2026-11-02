import {
    createRoute,
    lazyRouteComponent,
    redirect,
    SearchSchemaInput
} from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { prefetch } from "../_router/prefetch";
import { peopleQueryOptions } from "../_contexts/api/_peopleQueries";
import { clansQueryOptions } from "../_contexts/api/_clansQueries";
import { loadAreaSettings } from "../_contexts/settings/_migrate";
import { MediaFilters, isFlagSet } from "../_models/MediaFilters";

/*
   The people and clans picker. A person's and a clan's media hang under
   /people too, so the nav entry stays lit while browsing either - but they are
   the shared feeds, declared in _media/feed/_routeTree.tsx.
*/
export const peopleRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "people",
    beforeLoad: requireLogin,
    validateSearch: (search: MediaFilters & SearchSchemaInput): Pick<MediaFilters, "f"> =>
        isFlagSet((search as unknown as Record<string, unknown>).f) ? { f: true } : {},
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
    // this is the page itself rather than a stop on the way to one, so it only moves when it must
    beforeLoad: ({ search }) => {
        if (!search.f && loadAreaSettings().peopleFavoritesOnly) {
            throw redirect({ to: peopleRoute.to, search: { f: true }, replace: true });
        }
    },
    component: lazyRouteComponent(() => import("./Grid"))
});

export const peopleRouteTree = peopleRoute.addChildren([peopleGridRoute]);
