import {
    SearchSchemaInput,
    createRoute,
    lazyRouteComponent,
    linkOptions,
    redirect
} from "@tanstack/solid-router";

import { accountStatusQueryOptions } from "../_contexts/api/_configQueries";
import {
    ensureCategoryId,
    categoryMediaGpsQueryOptions,
    categoryMediaQueryOptions,
    categoryQueryOptions
} from "../_contexts/api/_categoryQueries";
import { RouterContext, rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { prefetch } from "../_router/prefetch";
import { redirectToGrid } from "../_media/_legacyViews";
import { loadMediaSettings } from "../_contexts/settings/_migrate";
import { MediaFilters, validateMediaFilters } from "../_models/MediaFilters";
import { MediaView, MediaViewBulkEdit, MediaViewMap } from "../_models/MediaView";

/*
   The category area, on TanStack Router's own typed routes rather than through
   the compatibility layer the rest of the application still uses.

   The names, icons and tooltips the toolbars show come from _routes.ts; what
   is here is what only a router can do. Because these are typed, a link or
   redirect to one of them is checked against its path and params when the
   application is compiled, rather than discovered broken when somebody clicks it.
*/

/*
   Starts a category's queries as soon as the route is matched - or merely
   hovered, with intent preloading - instead of once the page's code has
   arrived and mounted. Two steps, because the address names a category by year
   and slug and the api by id: the year's list (almost always cached already)
   gives the id, and then the category, its media and their locations go out
   together. Not awaited - see _router/prefetch.ts.
*/
const prefetchCategory = (context: RouterContext, categoryYear: string, categorySlug: string) =>
    prefetch(context, async (queryClient, getToken) => {
        const id = await ensureCategoryId(queryClient, getToken, categoryYear, categorySlug);

        if (id) {
            await Promise.all([
                queryClient.prefetchQuery(categoryQueryOptions(getToken, id)),
                queryClient.prefetchQuery(categoryMediaQueryOptions(getToken, id)),
                queryClient.prefetchQuery(categoryMediaGpsQueryOptions(getToken, id))
            ]);
        }
    });

export const categoryRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "categories/$categoryYear/$categorySlug",
    beforeLoad: requireLogin,
    validateSearch: (search: MediaFilters & SearchSchemaInput) =>
        validateMediaFilters(search as unknown as Record<string, unknown>),
    loader: ({ context, params }) =>
        prefetchCategory(context, params.categoryYear, params.categorySlug),
    component: lazyRouteComponent(() => import("../_media/MediaRoot"))
});

/*
   A category opens in whichever view was used last. A `beforeLoad`, so nothing
   renders on the way through. This was a component that mounted and then
   navigated, which put a blank page between the listing and the category - and
   the View Transition into the category then started from that blank page, so
   the toolbar faded in from nothing on every visit.

   Hovering a card preloads through this too, so it warms the view itself.
*/
const categoryIndexRoute = createRoute({
    getParentRoute: () => categoryRoute,
    path: "/",
    beforeLoad: ({ params }) => {
        throw redirect({
            ...categoryViewLink(loadMediaSettings().view, params.categoryYear, params.categorySlug),
            replace: true
        });
    }
});

export const categoryGridRoute = createRoute({
    getParentRoute: () => categoryRoute,
    path: "grid/{-$mediaSlug}",
    component: lazyRouteComponent(() => import("./Grid"))
});

const categoryDetailRedirectRoute = createRoute({
    getParentRoute: () => categoryRoute,
    path: "detail/{-$mediaSlug}",
    beforeLoad: redirectToGrid
});

const categoryFullscreenRedirectRoute = createRoute({
    getParentRoute: () => categoryRoute,
    path: "fullscreen/{-$mediaSlug}",
    beforeLoad: redirectToGrid
});

export const categoryMapRoute = createRoute({
    getParentRoute: () => categoryRoute,
    path: "map/{-$mediaSlug}",
    component: lazyRouteComponent(() => import("./Map"))
});

/*
   Admins only, decided before the screen exists. This replaces the AdminGuard
   the screen used to wrap itself in, which had to render first, wait for the
   account status to arrive, and then send a non-admin away - so a non-admin
   following a link saw the redirect happen, rather than never landing at all.

   The account status is the same cached query the rest of the application
   reads, so for anybody who has been here a moment this costs nothing.
*/
export const categoryBulkEditRoute = createRoute({
    getParentRoute: () => categoryRoute,
    path: "bulk-edit",
    beforeLoad: async ({ context, params }) => {
        const status = context.isLoggedIn()
            ? await context.queryClient
                  .ensureQueryData(accountStatusQueryOptions(context.getToken))
                  .catch(() => undefined)
            : undefined;

        if (!status?.isAdmin) {
            // checked when compiled: a wrong path, or a missing param, is a type error
            throw redirect({
                to: categoryGridRoute.to,
                params: {
                    categoryYear: params.categoryYear,
                    categorySlug: params.categorySlug
                },
                replace: true
            });
        }
    },
    component: lazyRouteComponent(() => import("./BulkEdit"))
});

/*
   A view of a category, optionally open on one of its photos - typed, so a
   view that does not exist, or a category address missing its year, fails to
   compile. Bulk edit works on the whole category, so it takes no photo.

   Every one carries the filters along, so they follow you between photos and
   views. A link that left them out would drop them: `search` is not inherited.
*/
export const categoryViewLink = (
    view: MediaView,
    categoryYear: string,
    categorySlug: string,
    mediaSlug?: string
) => {
    const params = { categoryYear, categorySlug, mediaSlug };

    switch (view) {
        case MediaViewMap:
            return linkOptions({
                to: categoryMapRoute.to,
                params,
                search: true
            });
        case MediaViewBulkEdit:
            return linkOptions({
                to: categoryBulkEditRoute.to,
                params: { categoryYear, categorySlug },
                search: true
            });
        default:
            return linkOptions({
                to: categoryGridRoute.to,
                params,
                search: true
            });
    }
};

export const categoryRouteTree = categoryRoute.addChildren([
    categoryIndexRoute,
    categoryGridRoute,
    categoryDetailRedirectRoute,
    categoryFullscreenRedirectRoute,
    categoryMapRoute,
    categoryBulkEditRoute
]);
