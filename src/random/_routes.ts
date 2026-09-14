import { lazy } from "solid-js";

import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { MediaViewGrid } from "../_models/MediaView";
import { MediaAppRouteDefinition } from "../_models/MediaAppRouteDefinition";
import { Media } from "../_models/Media";
import { Category } from "../_models/Category";

const basePath = "/random";

const buildRedirectRoute = (basePath: string): AppRouteDefinition => ({
    path: "/",
    absolutePath: basePath,
    name: "Redirect",
    component: lazy(() => import("./Redirect"))
});

const mediaSlugOrBlank = (category: Category | undefined, media: Media | undefined) => {
    if (!media) {
        return "";
    }

    return `/${media.categoryYear}/${media.categorySlug}/${media.slug}`;
};

const buildGridRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-apps]",
    name: "Grid",
    tooltip: "Grid View",
    mediaView: MediaViewGrid,
    path: "/grid/:categoryYear?/:categorySlug?/:mediaSlug?",
    absolutePath: `${basePath}/grid/:categoryYear?/:categorySlug?/:mediaSlug?`,
    component: lazy(() => import("./Grid")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) =>
        `${basePath}/grid${mediaSlugOrBlank(category, media)}`
});

const redirectRoute = buildRedirectRoute(basePath);
export const gridRoute = buildGridRoute(basePath);
// kept only so old links resolve - see DetailRedirect
export const detailRedirectRoute: AppRouteDefinition = {
    name: "Detail",
    path: "/detail/:categoryYear?/:categorySlug?/:mediaSlug?",
    absolutePath: `${basePath}/detail/:categoryYear?/:categorySlug?/:mediaSlug?`,
    component: lazy(() => import("../_media/DetailRedirect"))
};
// kept only so old links resolve - see FullscreenRedirect
export const fullscreenRedirectRoute: AppRouteDefinition = {
    name: "Fullscreen",
    path: "/fullscreen/:categoryYear?/:categorySlug?/:mediaSlug?",
    absolutePath: `${basePath}/fullscreen/:categoryYear?/:categorySlug?/:mediaSlug?`,
    component: lazy(() => import("../_media/FullscreenRedirect"))
};

export const randomMediaRoutes: AppRouteDefinition = {
    icon: "icon-[ic--round-shuffle]",
    name: "Random",
    helpText: "Play though an unending list of random photos.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("../_media/MediaRoot")),
    children: [redirectRoute, gridRoute, detailRedirectRoute, fullscreenRedirectRoute]
};
