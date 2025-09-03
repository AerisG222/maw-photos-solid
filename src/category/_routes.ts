import { lazy } from "solid-js";
import { AppRouteDefinition, AreaCategories } from "../_models/AppRouteDefinition";
import { routeMatch } from "../_models/utils/RouteUtils";

const basePath = "/categories/:categoryId";

const buildRedirectRoute = (basePath: string): AppRouteDefinition => ({
    path: "/",
    absolutePath: basePath,
    component: lazy(() => import("./Redirect"))
});

const buildGridRoute = (basePath: string): AppRouteDefinition => ({
    icon: "icon-[ic--outline-apps]",
    name: "Grid",
    tooltip: "Grid View",
    shortcutKeys: ["g"],
    path: "/grid/:id?",
    absolutePath: `${basePath}/grid/:id?`,
    component: lazy(() => import("./Grid"))
});

const buildDetailRoute = (basePath: string): AppRouteDefinition => ({
    icon: "icon-[ic--round-dashboard]",
    name: "Detail",
    tooltip: "Detail View",
    shortcutKeys: ["w"],
    path: "/detail/:id?",
    absolutePath: `${basePath}/detail/:id?`,
    component: lazy(() => import("./Detail"))
});

const buildFullscreenRoute = (basePath: string): AppRouteDefinition => ({
    icon: "icon-[ic--round-fullscreen]",
    name: "Fullscreen",
    tooltip: "Fullscreen View",
    shortcutKeys: ["f"],
    path: "/fullscreen/:id?",
    absolutePath: `${basePath}/fullscreen/:id?`,
    component: lazy(() => import("./Fullscreen"))
});

const buildMapRoute = (basePath: string): AppRouteDefinition => ({
    icon: "icon-[ic--round-map]",
    name: "Map",
    tooltip: "Map View",
    shortcutKeys: ["z"],
    path: "/map/:id?",
    absolutePath: `${basePath}/map/:id?`,
    component: lazy(() => import("./Map"))
});

const buildBulkEditRoute = (basePath: string): AppRouteDefinition => ({
    icon: "icon-[ic--round-collections]",
    name: "Bulk Edit",
    tooltip: "Bulk Edit View",
    shortcutKeys: ["b"],
    path: "/bulk-edit",
    absolutePath: `${basePath}/bulk-edit`,
    component: lazy(() => import("./BulkEdit"))
});

const redirectRoute = buildRedirectRoute(basePath);
export const gridRoute = buildGridRoute(basePath);
export const detailRoute = buildDetailRoute(basePath);
export const fullscreenRoute = buildFullscreenRoute(basePath);
export const mapRoute = buildMapRoute(basePath);
export const bulkEditRoute = buildBulkEditRoute(basePath);

export const mediaRoutes: AppRouteDefinition = {
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("../_media/MediaRoot")),
    doesPathMatch: path => routeMatch(path, "/categories", AreaCategories),
    children: [
        redirectRoute,
        gridRoute,
        detailRoute,
        fullscreenRoute,
        mapRoute,
        bulkEditRoute
    ]
};
