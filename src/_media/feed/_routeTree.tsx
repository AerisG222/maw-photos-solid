import { createRoute, lazyRouteComponent, redirect } from "@tanstack/solid-router";

import { rootRoute } from "../../_router/rootRoute";
import { requireLogin } from "../../_router/guards";
import { isUuid } from "../../_models/Uuid";
import { redirectToGrid } from "../_legacyViews";
import { FeedSearch, validateFeedSearch } from "./_search";
import { prefetch } from "../../_router/prefetch";
import { Uuid } from "../../_models/Uuid";
import {
    peopleQueryOptions,
    personCategoriesQueryOptions,
    personMediaQueryOptions
} from "../../_contexts/api/_peopleQueries";
import {
    clanCategoriesQueryOptions,
    clanMediaQueryOptions,
    clansQueryOptions
} from "../../_contexts/api/_clansQueries";
import {
    placeCategoriesQueryOptions,
    placeMediaQueryOptions,
    placeQueryOptions,
    prefetchPlaceChain
} from "../../_contexts/api/_placesQueries";
import { peopleRoute } from "../../people/_routeTree";
import { placesRoute } from "../../places/_routeTree";

/*
   The feeds, one tree per subject - a person, a clan, a place. Declared out in
   full rather than built by a function, so each path is a literal the router can
   check links against; the pages are shared, so all that differs is where each
   hangs.

   Clans sit under /people rather than at the root so the People nav entry stays
   lit while browsing one - a clan is a way into the same library, not a separate
   place. A place's feed hangs below the place rather than replacing it, because
   /places/{id} is already the drill-down into the places inside it.
*/

const MediaRoot = lazyRouteComponent(() => import("../MediaRoot"));
const FeedRedirect = lazyRouteComponent(() => import("./Redirect"));
const FeedGrid = lazyRouteComponent(() => import("./Grid"));
const FeedCategories = lazyRouteComponent(() => import("./Categories"));

/*
   Signed in, and an id rather than anything else. /people/clans on its own
   matches a person's feed with "clans" as the id; it, and any other address that
   is not an id, goes back to the listing it came from.

   Written out per route rather than shared through a helper: a helper taking
   the params would have to type them, and TanStack takes a route's params type
   from whatever its `beforeLoad` declares - so a shared `Record<string, string>`
   quietly made every one of these accept any param name at all.
*/
/*
   Typed as never - all each does is throw - rather than as TanStack's Redirect:
   that type is worked out from the whole route tree, which these routes are
   part of, and naming it here would make the tree depend on itself. The target
   is still checked, where each is written.
*/
const backToPeople = (): never => {
    throw redirect({ to: peopleRoute.to, replace: true });
};

const backToPlaces = (): never => {
    throw redirect({ to: placesRoute.to, params: {}, replace: true });
};

/*
   What each listing asks for, started from its route - see _router/prefetch.ts.
   The filter is read from the address exactly as the feed reads it, so the
   first page lands in the cache entry the feed then asks for. Each also starts
   whatever names the subject: the people or clan list, or the place and the
   chain above it.

   A feed opened with no filter of its own may take on a remembered one as it
   opens, which re-keys it; what this fetched is then simply not the page shown.
*/
const mediaFilter = (search: FeedSearch) => ({
    favoritesOnly: search.f === true,
    seed: search.seed
});
const categoriesFilter = (search: FeedSearch) => ({ favoritesOnly: search.f === true });

// ---- a person -------------------------------------------------------------

export const personFeedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "people/$personId",
    beforeLoad: async args => {
        await requireLogin(args);

        if (!isUuid(args.params.personId)) {
            backToPeople();
        }
    },
    validateSearch: validateFeedSearch,
    component: MediaRoot
});

const personFeedIndexRoute = createRoute({
    getParentRoute: () => personFeedRoute,
    path: "/",
    component: FeedRedirect
});

export const personFeedGridRoute = createRoute({
    getParentRoute: () => personFeedRoute,
    path: "grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
    loaderDeps: ({ search }) => mediaFilter(search),
    loader: ({ context, params, deps }) =>
        prefetch(context, (queryClient, getToken) =>
            Promise.all([
                queryClient.prefetchInfiniteQuery(
                    personMediaQueryOptions(getToken, params.personId as Uuid, deps)
                ),
                queryClient.prefetchQuery(peopleQueryOptions(getToken))
            ])
        ),
    component: FeedGrid
});

const personFeedDetailRoute = createRoute({
    getParentRoute: () => personFeedRoute,
    path: "detail/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
    beforeLoad: redirectToGrid
});

const personFeedFullscreenRoute = createRoute({
    getParentRoute: () => personFeedRoute,
    path: "fullscreen/{-$mediaSlug}",
    beforeLoad: redirectToGrid
});

export const personFeedCategoriesRoute = createRoute({
    getParentRoute: () => personFeedRoute,
    path: "categories",
    loaderDeps: ({ search }) => categoriesFilter(search),
    loader: ({ context, params, deps }) =>
        prefetch(context, (queryClient, getToken) =>
            Promise.all([
                queryClient.prefetchInfiniteQuery(
                    personCategoriesQueryOptions(
                        getToken,
                        params.personId as Uuid,
                        deps.favoritesOnly
                    )
                ),
                queryClient.prefetchQuery(peopleQueryOptions(getToken))
            ])
        ),
    component: FeedCategories
});

const personFeedTree = personFeedRoute.addChildren([
    personFeedIndexRoute,
    personFeedGridRoute,
    personFeedDetailRoute,
    personFeedFullscreenRoute,
    personFeedCategoriesRoute
]);

// ---- a clan ---------------------------------------------------------------

export const clanFeedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "people/clans/$clanId",
    beforeLoad: async args => {
        await requireLogin(args);

        if (!isUuid(args.params.clanId)) {
            backToPeople();
        }
    },
    validateSearch: validateFeedSearch,
    component: MediaRoot
});

const clanFeedIndexRoute = createRoute({
    getParentRoute: () => clanFeedRoute,
    path: "/",
    component: FeedRedirect
});

export const clanFeedGridRoute = createRoute({
    getParentRoute: () => clanFeedRoute,
    path: "grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
    loaderDeps: ({ search }) => mediaFilter(search),
    loader: ({ context, params, deps }) =>
        prefetch(context, (queryClient, getToken) =>
            Promise.all([
                queryClient.prefetchInfiniteQuery(
                    clanMediaQueryOptions(getToken, params.clanId as Uuid, deps)
                ),
                queryClient.prefetchQuery(clansQueryOptions(getToken))
            ])
        ),
    component: FeedGrid
});

const clanFeedDetailRoute = createRoute({
    getParentRoute: () => clanFeedRoute,
    path: "detail/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
    beforeLoad: redirectToGrid
});

const clanFeedFullscreenRoute = createRoute({
    getParentRoute: () => clanFeedRoute,
    path: "fullscreen/{-$mediaSlug}",
    beforeLoad: redirectToGrid
});

export const clanFeedCategoriesRoute = createRoute({
    getParentRoute: () => clanFeedRoute,
    path: "categories",
    loaderDeps: ({ search }) => categoriesFilter(search),
    loader: ({ context, params, deps }) =>
        prefetch(context, (queryClient, getToken) =>
            Promise.all([
                queryClient.prefetchInfiniteQuery(
                    clanCategoriesQueryOptions(getToken, params.clanId as Uuid, deps.favoritesOnly)
                ),
                queryClient.prefetchQuery(clansQueryOptions(getToken))
            ])
        ),
    component: FeedCategories
});

const clanFeedTree = clanFeedRoute.addChildren([
    clanFeedIndexRoute,
    clanFeedGridRoute,
    clanFeedDetailRoute,
    clanFeedFullscreenRoute,
    clanFeedCategoriesRoute
]);

// ---- a place --------------------------------------------------------------

export const placeFeedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "places/$placeId/media",
    beforeLoad: async args => {
        await requireLogin(args);

        if (!isUuid(args.params.placeId)) {
            backToPlaces();
        }
    },
    validateSearch: validateFeedSearch,
    component: MediaRoot
});

const placeFeedIndexRoute = createRoute({
    getParentRoute: () => placeFeedRoute,
    path: "/",
    component: FeedRedirect
});

export const placeFeedGridRoute = createRoute({
    getParentRoute: () => placeFeedRoute,
    path: "grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
    loaderDeps: ({ search }) => mediaFilter(search),
    loader: ({ context, params, deps }) =>
        prefetch(context, (queryClient, getToken) =>
            Promise.all([
                queryClient.prefetchInfiniteQuery(
                    placeMediaQueryOptions(getToken, params.placeId as Uuid, deps)
                ),
                queryClient.prefetchQuery(placeQueryOptions(getToken, params.placeId as Uuid)),
                prefetchPlaceChain(queryClient, getToken, params.placeId as Uuid)
            ])
        ),
    component: FeedGrid
});

const placeFeedDetailRoute = createRoute({
    getParentRoute: () => placeFeedRoute,
    path: "detail/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
    beforeLoad: redirectToGrid
});

const placeFeedFullscreenRoute = createRoute({
    getParentRoute: () => placeFeedRoute,
    path: "fullscreen/{-$mediaSlug}",
    beforeLoad: redirectToGrid
});

export const placeFeedCategoriesRoute = createRoute({
    getParentRoute: () => placeFeedRoute,
    path: "categories",
    loaderDeps: ({ search }) => categoriesFilter(search),
    loader: ({ context, params, deps }) =>
        prefetch(context, (queryClient, getToken) =>
            Promise.all([
                queryClient.prefetchInfiniteQuery(
                    placeCategoriesQueryOptions(
                        getToken,
                        params.placeId as Uuid,
                        deps.favoritesOnly
                    )
                ),
                queryClient.prefetchQuery(placeQueryOptions(getToken, params.placeId as Uuid)),
                prefetchPlaceChain(queryClient, getToken, params.placeId as Uuid)
            ])
        ),
    component: FeedCategories
});

const placeFeedTree = placeFeedRoute.addChildren([
    placeFeedIndexRoute,
    placeFeedGridRoute,
    placeFeedDetailRoute,
    placeFeedFullscreenRoute,
    placeFeedCategoriesRoute
]);

export const feedRouteTrees = [personFeedTree, clanFeedTree, placeFeedTree] as const;
