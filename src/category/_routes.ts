import { lazy } from "solid-js";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import {
    MediaViewBulkEdit,
    MediaViewDetail,
    MediaViewFullscreen,
    MediaViewGrid,
    MediaViewMap
} from "../_models/MediaView";
import { MediaAppRouteDefinition } from "../_models/MediaAppRouteDefinition";
import { Media } from "../_models/Media";
import { Category } from "../_models/Category";
import { getCategoryPath } from '../categories/_routes';

const basePath = "/categories/:categoryYear/:categorySlug";

const buildRedirectRoute = (basePath: string): AppRouteDefinition => ({
    path: "/",
    absolutePath: basePath,
    name: "Redirect",
    component: lazy(() => import("./Redirect"))
});

const slugOrBlank = (media: Media | undefined) => (media ? `/${media.slug}` : "");

const buildGridRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--outline-apps]",
    name: "Grid",
    tooltip: "Grid View",
    mediaView: MediaViewGrid,
    shortcutKeys: ["g"],
    path: "/grid/:mediaSlug?",
    absolutePath: `${basePath}/grid/:mediaSlug?`,
    component: lazy(() => import("./Grid")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) =>
        `${getCategoryPath(category!.year, category!.slug)}/grid${slugOrBlank(media)}`
});

const buildDetailRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-dashboard]",
    name: "Detail",
    tooltip: "Detail View",
    mediaView: MediaViewDetail,
    shortcutKeys: ["w"],
    path: "/detail/:mediaSlug?",
    absolutePath: `${basePath}/detail/:mediaSlug?`,
    component: lazy(() => import("./Detail")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) =>
        `${getCategoryPath(category!.year, category!.slug)}/detail${slugOrBlank(media)}`
});

const buildFullscreenRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-fullscreen]",
    name: "Fullscreen",
    tooltip: "Fullscreen View",
    mediaView: MediaViewFullscreen,
    shortcutKeys: ["f"],
    path: "/fullscreen/:mediaSlug?",
    absolutePath: `${basePath}/fullscreen/:mediaSlug?`,
    component: lazy(() => import("./Fullscreen")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) =>
        `${getCategoryPath(category!.year, category!.slug)}/fullscreen${slugOrBlank(media)}`
});

const buildMapRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-map]",
    name: "Map",
    tooltip: "Map View",
    mediaView: MediaViewMap,
    shortcutKeys: ["z"],
    path: "/map/:mediaSlug?",
    absolutePath: `${basePath}/map/:mediaSlug?`,
    component: lazy(() => import("./Map")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) =>
        `${getCategoryPath(category!.year, category!.slug)}/map${slugOrBlank(media)}`
});

const buildBulkEditRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-collections]",
    name: "Bulk Edit",
    tooltip: "Bulk Edit View",
    mediaView: MediaViewBulkEdit,
    shortcutKeys: ["/"],
    path: "/bulk-edit",
    absolutePath: `${basePath}/bulk-edit`,
    component: lazy(() => import("./BulkEdit")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) =>
        `${getCategoryPath(category!.year, category!.slug)}/bulk-edit`
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
    name: "Category",
    component: lazy(() => import("../_media/MediaRoot")),
    children: [redirectRoute, gridRoute, detailRoute, fullscreenRoute, mapRoute, bulkEditRoute]
};
