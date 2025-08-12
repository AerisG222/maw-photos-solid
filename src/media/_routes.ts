import { lazy } from "solid-js";
import { AppRouteDefinition, AreaCategories, AreaRandom } from "../_models/AppRouteDefinition";
import { CategoryType } from "../_models/CategoryType";
import { buildPath, routeMatch } from "../_models/utils/RouteUtils";

export const MediaViewModeBulkEdit = "bulk-edit";
export const MediaViewModeDetail = "detail";
export const MediaViewModeFullscreen = "fullscreen";
export const MediaViewModeGrid = "grid";
export const MediaViewModeMap = "map";

export type MediaView =
    typeof MediaViewModeBulkEdit |
    typeof MediaViewModeDetail |
    typeof MediaViewModeFullscreen |
    typeof MediaViewModeGrid |
    typeof MediaViewModeMap;

export const MediaViewAll: MediaView[] = [
    MediaViewModeBulkEdit,
    MediaViewModeDetail,
    MediaViewModeFullscreen,
    MediaViewModeGrid,
    MediaViewModeMap,
];

const categoryBasePath = "/categories/:categoryType/:categoryId";
const randomBasePath = "/random";

const buildRedirectRoute = (basePath: string): AppRouteDefinition => ({
    path: "/",
    absolutePath: basePath,
    component: lazy(() => import("./Redirect"))
});

const buildGridRoute = (basePath: string): AppRouteDefinition => ({
    icon: "icon-[ic--outline-apps]",
    name: "Grid View",
    tooltip: "Grid View",
    shortcutKeys: ["g"],
    path: "/grid/:id?",
    absolutePath: `${basePath}/grid/:id?`,
    component: lazy(() => import("./ViewGrid"))
});

const buildDetailRoute = (basePath: string): AppRouteDefinition => ({
    icon: "icon-[ic--round-dashboard]",
    name: "Detail View",
    tooltip: "Detail View",
    shortcutKeys: ["w"],
    path: "/detail/:id?",
    absolutePath: `${basePath}/detail/:id?`,
    component: lazy(() => import("./ViewDetail"))
});

const buildFullscreenRoute = (basePath: string): AppRouteDefinition => ({
    icon: "icon-[ic--round-fullscreen]",
    name: "Fullscreen View",
    tooltip: "Fullscreen View",
    shortcutKeys: ["f"],
    path: "/fullscreen/:id?",
    absolutePath: `${basePath}/fullscreen/:id?`,
    component: lazy(() => import("./ViewFullscreen"))
});

const buildMapRoute = (basePath: string): AppRouteDefinition => ({
    icon: "icon-[ic--round-map]",
    name: "Map View",
    tooltip: "Map View",
    shortcutKeys: ["z"],
    path: "/map/:id?",
    absolutePath: `${basePath}/map/:id?`,
    component: lazy(() => import("./ViewMap"))
});

const buildBulkEditRoute = (basePath: string): AppRouteDefinition => ({
    icon: "icon-[ic--round-collections]",
    name: "Bulk Edit View",
    tooltip: "Bulk Edit View",
    shortcutKeys: ["b"],
    path: "/bulk-edit",
    absolutePath: `${basePath}/bulk-edit`,
    component: lazy(() => import("./ViewBulkEdit"))
});

const categoryRedirectRoute = buildRedirectRoute(categoryBasePath);
export const categoryGridRoute = buildGridRoute(categoryBasePath);
export const categoryDetailRoute = buildDetailRoute(categoryBasePath);
export const categoryFullscreenRoute = buildFullscreenRoute(categoryBasePath);
export const categoryMapRoute = buildMapRoute(categoryBasePath);
export const categoryBulkEditRoute = buildBulkEditRoute(categoryBasePath);

export const categoryMediaRoutes: AppRouteDefinition = {
    path: categoryBasePath,
    absolutePath: categoryBasePath,
    component: lazy(() => import("./MediaRoot")),
    doesPathMatch: path => routeMatch(path, "/categories", AreaCategories),
    children: [
        categoryRedirectRoute,
        categoryGridRoute,
        categoryDetailRoute,
        categoryFullscreenRoute,
        categoryMapRoute,
        categoryBulkEditRoute,
    ]
};

const randomRedirectRoute = buildRedirectRoute(randomBasePath);
export const randomGridRoute = buildGridRoute(randomBasePath);
export const randomDetailRoute = buildDetailRoute(randomBasePath);
export const randomFullscreenRoute = buildFullscreenRoute(randomBasePath);

export const randomMediaRoutes: AppRouteDefinition = {
    icon: "icon-[ic--round-shuffle]",
    name: "Random",
    helpText: "Play though an unending list of random photos.",
    path: randomBasePath,
    absolutePath: randomBasePath,
    component: lazy(() => import("./MediaRoot")),
    doesPathMatch: path => routeMatch(path, randomBasePath, AreaRandom),
    children: [
        randomRedirectRoute,
        randomGridRoute,
        randomDetailRoute,
        randomFullscreenRoute,
    ]
};

export const getMediaCategoryPath = (categoryType: CategoryType, categoryId: number): string =>
    buildPath(categoryMediaRoutes, {categoryType, categoryId});

export const getMediaPathByView = (viewMode: MediaView, categoryType: CategoryType, categoryId: number, id?: number): string =>
    getMediaPath(getRouteForViewMode(viewMode), categoryType, categoryId, id);

export const getMediaPath = (route: AppRouteDefinition, categoryType: CategoryType, categoryId: number, id?: number): string =>
    buildPath(route, {categoryType, categoryId, id});

const getRouteForViewMode = (mode: MediaView): AppRouteDefinition => {
    switch(mode) {
        case MediaViewModeBulkEdit:
            return categoryBulkEditRoute;
        case MediaViewModeDetail:
            return categoryDetailRoute;
        case MediaViewModeFullscreen:
            return categoryFullscreenRoute;
        case MediaViewModeGrid:
            return categoryGridRoute;
        case MediaViewModeMap:
            return categoryMapRoute;
        default:
            // eslint-disable-next-line no-case-declarations
            const _exhaustiveCheck: never = mode;
            return _exhaustiveCheck;
    }
};
