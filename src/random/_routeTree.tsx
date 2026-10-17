import { createRoute, lazyRouteComponent, redirect } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { redirectToGrid } from "../_media/_legacyViews";

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
