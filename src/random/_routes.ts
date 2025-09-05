import { lazy } from 'solid-js';

import { routeMatch } from '../_models/utils/RouteUtils';
import { AppRouteDefinition, AreaRandom } from '../_models/AppRouteDefinition';
import { MediaViewModeDetail, MediaViewModeFullscreen, MediaViewModeGrid } from '../_media/models/MediaView';
import { MediaAppRouteDefinition } from '../_models/MediaAppRouteDefinition';
import { Media } from '../_models/Media';
import { Category } from '../_models/Category';

const basePath = "/random";

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
    mediaView: MediaViewModeGrid,
    shortcutKeys: ["g"],
    path: "/grid/:id?",
    absolutePath: `${basePath}/grid/:id?`,
    component: lazy(() => import("./Grid")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) => `${basePath}/grid${idOrBlank(media)}`
});

const buildDetailRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-dashboard]",
    name: "Detail",
    tooltip: "Detail View",
    mediaView: MediaViewModeDetail,
    shortcutKeys: ["w"],
    path: "/detail/:id?",
    absolutePath: `${basePath}/detail/:id?`,
    component: lazy(() => import("./Detail")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) => `${basePath}/detail${idOrBlank(media)}`
});

const buildFullscreenRoute = (basePath: string): MediaAppRouteDefinition => ({
    icon: "icon-[ic--round-fullscreen]",
    name: "Fullscreen",
    tooltip: "Fullscreen View",
    mediaView: MediaViewModeFullscreen,
    shortcutKeys: ["f"],
    path: "/fullscreen/:id?",
    absolutePath: `${basePath}/fullscreen/:id?`,
    component: lazy(() => import("./Fullscreen")),
    buildPathForMedia: (category: Category | undefined, media: Media | undefined) => `${basePath}/fullscreen${idOrBlank(media)}`
});


const redirectRoute = buildRedirectRoute(basePath);
export const gridRoute = buildGridRoute(basePath);
export const detailRoute = buildDetailRoute(basePath);
export const fullscreenRoute = buildFullscreenRoute(basePath);

export const randomMediaRoutes: AppRouteDefinition = {
    icon: "icon-[ic--round-shuffle]",
    name: "Random",
    helpText: "Play though an unending list of random photos.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("../_media/MediaRoot")),
    doesPathMatch: path => routeMatch(path, basePath, AreaRandom),
    children: [redirectRoute, gridRoute, detailRoute, fullscreenRoute]
};
