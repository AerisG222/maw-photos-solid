import {
    SearchSchemaInput,
    createRoute,
    lazyRouteComponent,
    redirect
} from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";
import { requireLogin } from "../_router/guards";
import { loadAreaSettings } from "../_contexts/settings/_migrate";
import { MediaFilters, validateMediaFilters } from "../_models/MediaFilters";
import { equalsIgnoreCase } from "../_models/utils/StringUtils";

export const searchRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "search",
    beforeLoad: requireLogin,
    validateSearch: (search: MediaFilters & SearchSchemaInput) =>
        validateMediaFilters(search as unknown as Record<string, unknown>),
    component: lazyRouteComponent(() => import("./Layout"))
});

// opens on whichever view and filters were used last, before anything renders
const searchIndexRoute = createRoute({
    getParentRoute: () => searchRoute,
    path: "/",
    beforeLoad: ({ search }) => {
        const area = loadAreaSettings();

        throw redirect({
            to: equalsIgnoreCase("list", area.searchView) ? searchListRoute.to : searchGridRoute.to,
            search: { ...area.searchFilters, ...search },
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
