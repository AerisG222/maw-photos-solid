import { createRoute, lazyRouteComponent, redirect } from "@tanstack/solid-router";

import { rootRoute } from "../../_router/rootRoute";
import { requireLogin } from "../../_router/guards";
import { isUuid } from "../../_models/Uuid";
import { redirectToGrid } from "../_legacyViews";
import { validateFeedSearch } from "./_routes";

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
    throw redirect({ to: "/people", replace: true });
};

const backToPlaces = (): never => {
    throw redirect({ to: "/places/{-$placeId}", params: {}, replace: true });
};

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

const personFeedGridRoute = createRoute({
    getParentRoute: () => personFeedRoute,
    path: "grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
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

const personFeedCategoriesRoute = createRoute({
    getParentRoute: () => personFeedRoute,
    path: "categories",
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

const clanFeedGridRoute = createRoute({
    getParentRoute: () => clanFeedRoute,
    path: "grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
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

const clanFeedCategoriesRoute = createRoute({
    getParentRoute: () => clanFeedRoute,
    path: "categories",
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

const placeFeedGridRoute = createRoute({
    getParentRoute: () => placeFeedRoute,
    path: "grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
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

const placeFeedCategoriesRoute = createRoute({
    getParentRoute: () => placeFeedRoute,
    path: "categories",
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
