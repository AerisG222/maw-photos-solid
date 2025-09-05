import { lazy } from "solid-js";
import { AppRouteDefinition, AreaCategories } from "../_models/AppRouteDefinition";
import { routeMatch } from "../_models/utils/RouteUtils";
import { MediaViewBulkEdit, MediaViewDetail, MediaViewFullscreen, MediaViewGrid, MediaViewMap } from '../_models/MediaView';
import { MediaAppRouteDefinition } from '../_models/MediaAppRouteDefinition';
import { Media } from '../_models/Media';
import { Category } from '../_models/Category';

const basePath = "/categories/:categoryId";

const buildRedirectRoute = (basePath: string): AppRouteDefinition => ({
    path: "/",
    absolutePath: basePath,
    name: 'Redirect',
    component: lazy(() => import("./Redirect"))
});

const idOrBlank = (media: Media | undefined) => media ? `/${media.id}` : "";

const buildGridRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--outline-apps]",
    name: "Grid",
    tooltip: "Grid View",
    mediaView: MediaViewGrid,
    shortcutKeys: ["g"],
    path: "/grid/:id?",
    absolutePath: `${basePath}/grid/:id?`,
    component: lazy(() => import("./Grid")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) => `/categories/${category!.id}/grid${idOrBlank(media)}`
});

const buildDetailRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-dashboard]",
    name: "Detail",
    tooltip: "Detail View",
    mediaView: MediaViewDetail,
    shortcutKeys: ["w"],
    path: "/detail/:id?",
    absolutePath: `${basePath}/detail/:id?`,
    component: lazy(() => import("./Detail")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) => `/categories/${category!.id}/detail${idOrBlank(media)}`
});

const buildFullscreenRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-fullscreen]",
    name: "Fullscreen",
    tooltip: "Fullscreen View",
    mediaView: MediaViewFullscreen,
    shortcutKeys: ["f"],
    path: "/fullscreen/:id?",
    absolutePath: `${basePath}/fullscreen/:id?`,
    component: lazy(() => import("./Fullscreen")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) => `/categories/${category!.id}/fullscreen${idOrBlank(media)}`
});

const buildMapRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-map]",
    name: "Map",
    tooltip: "Map View",
    mediaView: MediaViewMap,
    shortcutKeys: ["z"],
    path: "/map/:id?",
    absolutePath: `${basePath}/map/:id?`,
    component: lazy(() => import("./Map")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) => `/categories/${category!.id}/map${idOrBlank(media)}`
});

const buildBulkEditRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-collections]",
    name: "Bulk Edit",
    tooltip: "Bulk Edit View",
    mediaView: MediaViewBulkEdit,
    shortcutKeys: ["b"],
    path: "/bulk-edit",
    absolutePath: `${basePath}/bulk-edit`,
    component: lazy(() => import("./BulkEdit")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) => `/categories/${category!.id}/bulk-edit`
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
    name: 'Category',
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
