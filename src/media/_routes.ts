import { lazy } from 'solid-js';
import { AppRouteDefinition } from '../models/AppRouteDefinition';
import { CategoryType } from '../models/CategoryType';
import { buildPath } from '../models/utils/RouteUtils';
//import { categories } from '../categories/_routes';

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

const basePath = `/categories/:categoryType/:categoryId`;

const buildRedirectRoute = (basePath: string): AppRouteDefinition => ({
    path: '/',
    absolutePath: basePath,
    component: lazy(() => import('./Redirect'))
});

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

const redirectRoute = buildRedirectRoute(basePath);
export const gridRoute = buildGridRoute(basePath);
export const detailRoute = buildDetailRoute(basePath);
export const fullscreenRoute = buildFullscreenRoute(basePath);
export const mapRoute = buildMapRoute(basePath);
export const bulkEditRoute = buildBulkEditRoute(basePath);

export const mediaRoutes: AppRouteDefinition = {
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import('./MediaCategory')),
    children: [
        redirectRoute,
        gridRoute,
        detailRoute,
        fullscreenRoute,
        mapRoute,
        bulkEditRoute,
    ]
};

export const getMediaCategoryPath = (categoryType: CategoryType, categoryId: number): string =>
    buildPath(mediaRoutes, {categoryType, categoryId});

export const getMediaPathByView = (viewMode: MediaView, categoryType: CategoryType, categoryId: number, id?: number): string =>
    getMediaPath(getRouteForViewMode(viewMode), categoryType, categoryId, id);

export const getMediaPath = (route: AppRouteDefinition, categoryType: CategoryType, categoryId: number, id?: number): string =>
    buildPath(route, {categoryType, categoryId, id});

const getRouteForViewMode = (mode: MediaView): AppRouteDefinition => {
    switch(mode) {
        case MediaViewModeBulkEdit:
            return bulkEditRoute;
        case MediaViewModeDetail:
            return detailRoute;
        case MediaViewModeFullscreen:
            return fullscreenRoute;
        case MediaViewModeGrid:
            return gridRoute;
        case MediaViewModeMap:
            return mapRoute;
        default:
            // eslint-disable-next-line no-case-declarations
            const _exhaustiveCheck: never = mode;
            return _exhaustiveCheck;
    }
};
