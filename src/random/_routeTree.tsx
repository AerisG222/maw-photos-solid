import { createRoute, lazyRouteComponent, redirect } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { redirectToGrid } from "../_media/_legacyViews";
import { prefetch } from "../_router/prefetch";
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
            params: {},
            replace: true
        });
    }
});

export const randomGridRoute = createRoute({
    getParentRoute: () => randomRoute,
    path: "grid/{-$categoryYear}/{-$categorySlug}/{-$mediaSlug}",
    // the first page of the stack - never stale, so once drawn this does nothing
    loader: ({ context }) =>
        prefetch(context, (queryClient, getToken) =>
            queryClient.prefetchInfiniteQuery(randomMediaQueryOptions(getToken, MEDIA_PAGE_SIZE))
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
