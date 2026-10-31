import { createRoute, lazyRouteComponent, redirect } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { loadAreaSettings } from "../_contexts/settings/_migrate";
import { equalsIgnoreCase } from "../_models/utils/StringUtils";

export const searchRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "search",
    beforeLoad: requireLogin,
    component: lazyRouteComponent(() => import("./Layout"))
});

// opens on whichever view was used last, before anything renders
const searchIndexRoute = createRoute({
    getParentRoute: () => searchRoute,
    path: "/",
    beforeLoad: () => {
        throw redirect({
            to: equalsIgnoreCase("list", loadAreaSettings().searchView)
                ? searchListRoute.to
                : searchGridRoute.to,
            replace: true
        });
    }
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
