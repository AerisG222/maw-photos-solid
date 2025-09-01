import { lazy } from 'solid-js';

import { routeMatch } from '../_models/utils/RouteUtils';
import { AppRouteDefinition, AreaRandom } from '../_models/AppRouteDefinition';

const basePath = "/random";

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


const randomRedirectRoute = buildRedirectRoute(basePath);
export const randomGridRoute = buildGridRoute(basePath);
export const randomDetailRoute = buildDetailRoute(basePath);
export const randomFullscreenRoute = buildFullscreenRoute(basePath);

export const randomMediaRoutes: AppRouteDefinition = {
    icon: "icon-[ic--round-shuffle]",
    name: "Random",
    helpText: "Play though an unending list of random photos.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("../media/MediaRoot")),
    doesPathMatch: path => routeMatch(path, basePath, AreaRandom),
    children: [randomRedirectRoute, randomGridRoute, randomDetailRoute, randomFullscreenRoute]
};
