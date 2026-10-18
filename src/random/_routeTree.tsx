import { createRoute, lazyRouteComponent, redirect } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { redirectToGrid } from "../_media/_legacyViews";
import { prefetch } from "../_router/prefetch";
import { prefetchAddressedCategory } from "../_contexts/api/_categoryQueries";
import { randomMediaQueryOptions } from "../_contexts/api/_mediaQueries";
import { MEDIA_PAGE_SIZE } from "../_models/utils/Constants";

export const randomRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "random",
    beforeLoad: requireLogin,
    component: lazyRouteComponent(() => import("../_media/MediaRoot"))
});

const randomIndexRoute = createRoute({
    getParentRoute: () => randomRoute,
    path: "/",
    beforeLoad: () => {
        throw redirect({
            to: randomGridRoute.to,
            // named, so nothing is carried over - see photoParams
            params: { categoryYear: undefined, categorySlug: undefined, mediaSlug: undefined },
            replace: true
        });
    }
});

export const randomGridRoute = createRoute({
    getParentRoute: () => randomRoute,
    path: "grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
    /*
       The first page of the stack - never stale, so once drawn this does
       nothing - and, when the address has a photo open, its category for the
       breadcrumb.
    */
    loader: ({ context, params }) =>
        prefetch(context, (queryClient, getToken) =>
            Promise.all([
                queryClient.prefetchInfiniteQuery(
                    randomMediaQueryOptions(getToken, MEDIA_PAGE_SIZE)
                ),
                prefetchAddressedCategory(
                    queryClient,
                    getToken,
                    params.categoryYear,
                    params.categorySlug
                )
            ])
        ),
    component: lazyRouteComponent(() => import("./Grid"))
});

const randomDetailRoute = createRoute({
    getParentRoute: () => randomRoute,
    path: "detail/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
    beforeLoad: redirectToGrid
});

const randomFullscreenRoute = createRoute({
    getParentRoute: () => randomRoute,
    path: "fullscreen/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
    beforeLoad: redirectToGrid
});

export const randomRouteTree = randomRoute.addChildren([
    randomIndexRoute,
    randomGridRoute,
    randomDetailRoute,
    randomFullscreenRoute
]);
