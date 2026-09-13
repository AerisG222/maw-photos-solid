import { lazy } from "solid-js";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import {
    MediaViewBulkEdit,
    MediaViewFullscreen,
    MediaViewGrid,
    MediaViewMap
} from "../_models/MediaView";
import { MediaAppRouteDefinition } from "../_models/MediaAppRouteDefinition";
import { Media } from "../_models/Media";
import { Category } from "../_models/Category";
import { getCategoryPath } from "../categories/_routes";

const basePath = "/categories/:categoryYear/:categorySlug";

const buildRedirectRoute = (basePath: string): AppRouteDefinition => ({
    path: "/",
    absolutePath: basePath,
    name: "Redirect",
    component: lazy(() => import("./Redirect"))
});

const slugOrBlank = (media: Media | undefined) => (media ? `/${media.slug}` : "");

const buildGridRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-apps]",
    name: "Grid",
    tooltip: "Grid View",
    mediaView: MediaViewGrid,
    path: "/grid/:mediaSlug?",
    absolutePath: `${basePath}/grid/:mediaSlug?`,
    component: lazy(() => import("./Grid")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) =>
        `${getCategoryPath(category!.year, category!.slug)}/grid${slugOrBlank(media)}`
});

const buildFullscreenRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-fullscreen]",
    name: "Fullscreen",
    tooltip: "Fullscreen View",
    mediaView: MediaViewFullscreen,
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
    path: "/bulk-edit",
    absolutePath: `${basePath}/bulk-edit`,
    component: lazy(() => import("./BulkEdit")),
    buildPathForMedia: (category: Category | undefined, _media: Media | undefined) =>
        `${getCategoryPath(category!.year, category!.slug)}/bulk-edit`
});

const redirectRoute = buildRedirectRoute(basePath);
export const gridRoute = buildGridRoute(basePath);
/*
   Kept only so old links resolve - see DetailRedirect. No `mediaView`, so it
   never appears among the views a toolbar offers.
*/
export const detailRedirectRoute: AppRouteDefinition = {
    name: "Detail",
    path: "/detail/:mediaSlug?",
    absolutePath: `${basePath}/detail/:mediaSlug?`,
    component: lazy(() => import("../_media/DetailRedirect"))
};
export const fullscreenRoute = buildFullscreenRoute(basePath);
export const mapRoute = buildMapRoute(basePath);
export const bulkEditRoute = buildBulkEditRoute(basePath);

export const mediaRoutes: AppRouteDefinition = {
    path: basePath,
    absolutePath: basePath,
    name: "Category",
    component: lazy(() => import("../_media/MediaRoot")),
    children: [
        redirectRoute,
        gridRoute,
        detailRedirectRoute,
        fullscreenRoute,
        mapRoute,
        bulkEditRoute
    ]
};
