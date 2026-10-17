import { createRoute, lazyRouteComponent } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";

export const searchRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "search",
    beforeLoad: requireLogin,
    component: lazyRouteComponent(() => import("./Layout"))
});

// opens on whichever view was used last - a setting, so decided by a component that can read it
const searchIndexRoute = createRoute({
    getParentRoute: () => searchRoute,
    path: "/",
    component: lazyRouteComponent(() => import("./Redirect"))
});

export const searchGridRoute = createRoute({
    getParentRoute: () => searchRoute,
    path: "grid",
    component: lazyRouteComponent(() => import("./Grid"))
});

export const searchListRoute = createRoute({
    getParentRoute: () => searchRoute,
    path: "list",
    component: lazyRouteComponent(() => import("./List"))
});

export const searchRouteTree = searchRoute.addChildren([
    searchIndexRoute,
    searchGridRoute,
    searchListRoute
]);
