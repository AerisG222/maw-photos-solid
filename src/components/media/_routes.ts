import { lazy } from 'solid-js';
import { AppRouteDefinition } from '../../models/AppRouteDefinition';

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

export const buildMediaRoutes = (basePath: string, views: MediaView[]) => {
    const mediaRoutes = {};

    if(views.indexOf(MediaViewModeGrid) >= 0) {
        mediaRoutes[MediaViewModeGrid] = buildGridRoute(basePath);
    }

    if(views.indexOf(MediaViewModeDetail) >= 0) {
        mediaRoutes[MediaViewModeDetail] = buildDetailRoute(basePath);
    }

    if(views.indexOf(MediaViewModeFullscreen) >= 0) {
        mediaRoutes[MediaViewModeFullscreen] = buildFullscreenRoute(basePath);
    }

    if(views.indexOf(MediaViewModeMap) >= 0) {
        mediaRoutes[MediaViewModeMap] = buildMapRoute(basePath);
    }

    if(views.indexOf(MediaViewModeBulkEdit) >= 0) {
        mediaRoutes[MediaViewModeBulkEdit] = buildBulkEditRoute(basePath);
    }

    return mediaRoutes;
};

const buildGridRoute = (basePath: string): AppRouteDefinition => ({
    icon: "i-ic-outline-apps",
    name: "Grid View",
    tooltip: "Grid View (G)",
    shortcutKeys: ['g'],
    path: "/grid/:id?",
    absolutePath: `${basePath}/grid/:id?`,
    component: lazy(() => import('./ViewGrid'))
});

const buildDetailRoute = (basePath: string): AppRouteDefinition => ({
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    tooltip: "Detail View (W)",
    shortcutKeys: ['w'],
    path: '/detail/:id?',
    absolutePath: `${basePath}/detail/:id?`,
    component: lazy(() => import('./ViewDetail'))
});

const buildFullscreenRoute = (basePath: string): AppRouteDefinition => ({
    icon: "i-ic-round-fullscreen",
    name: "Fullscreen View",
    tooltip: "Fullscreen View (F)",
    shortcutKeys: ['f'],
    path: '/fullscreen/:id?',
    absolutePath: `${basePath}/fullscreen/:id?`,
    component: lazy(() => import('./ViewFullscreen'))
});

const buildMapRoute = (basePath: string): AppRouteDefinition => ({
    icon: "i-ic-round-map",
    name: "Map View",
    tooltip: "Map View (Z)",
    shortcutKeys: ['z'],
    path: '/map/:id?',
    absolutePath: `${basePath}/map/:id?`,
    component: lazy(() => import('./ViewMap'))
});

const buildBulkEditRoute = (basePath: string): AppRouteDefinition => ({
    icon: "i-ic-round-collections",
    name: "Bulk Edit View",
    tooltip: "Bulk Edit View (B)",
    shortcutKeys: ['b'],
    path: '/bulk-edit',
    absolutePath: `${basePath}/bulk-edit`,
    component: lazy(() => import('./ViewBulkEdit'))
});
