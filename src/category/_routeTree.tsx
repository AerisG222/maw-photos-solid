import { createRoute, lazyRouteComponent, redirect } from "@tanstack/solid-router";

import {
    accountStatusQueryOptions,
    categoriesForYearQueryOptions,
    categoryMediaGpsQueryOptions,
    categoryMediaQueryOptions,
    categoryQueryOptions
} from "../_contexts/api/_routeQueries";
import { RouterContext, rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { redirectToGrid } from "../_media/_legacyViews";

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
   together.

   Not awaited. The page asks for the same queries and renders its own loading
   state, exactly as before; this only means the answers are on their way
   sooner. Holding navigation until they land would trade a skeleton for a
   frozen click.
*/
const prefetchCategory = (context: RouterContext, categoryYear: string, categorySlug: string) => {
    if (!context.isLoggedIn()) {
        return;
    }

    const { queryClient, getToken } = context;
    const year = parseInt(categoryYear, 10);

    void (async () => {
        const forYear = await queryClient.ensureQueryData(
            categoriesForYearQueryOptions(getToken, year)
        );
        const id = forYear.categories.find(c => c.slug === categorySlug)?.id;

        if (id) {
            await Promise.all([
                queryClient.prefetchQuery(categoryQueryOptions(getToken, id)),
                queryClient.prefetchQuery(categoryMediaQueryOptions(getToken, id)),
                queryClient.prefetchQuery(categoryMediaGpsQueryOptions(getToken, id))
            ]);
        }
    })().catch(() => {
        // the page asks again for itself, and shows the error if there is one
    });
};

export const categoryRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "categories/$categoryYear/$categorySlug",
    beforeLoad: requireLogin,
    loader: ({ context, params }) =>
        prefetchCategory(context, params.categoryYear, params.categorySlug),
    component: lazyRouteComponent(() => import("../_media/MediaRoot"))
});

const categoryIndexRoute = createRoute({
    getParentRoute: () => categoryRoute,
    path: "/",
    component: lazyRouteComponent(() => import("./Redirect"))
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
                to: "/categories/$categoryYear/$categorySlug/grid/{-$mediaSlug}",
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

export const categoryRouteTree = categoryRoute.addChildren([
    categoryIndexRoute,
    categoryGridRoute,
    categoryDetailRedirectRoute,
    categoryFullscreenRedirectRoute,
    categoryMapRoute,
    categoryBulkEditRoute
]);
