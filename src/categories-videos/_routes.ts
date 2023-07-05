import { lazy } from 'solid-js';

import { categories } from '../categories/_routes';
import { AppRouteDefinition } from '../models/AppRouteDefinition';
import { buildPath } from '../models/utils/RouteUtils';
import { equalsIgnoreCase } from '../models/utils/StringUtils';

const basePath = `${categories.absolutePath}/videos/:categoryId`;

export const categoriesVideosRedirect: AppRouteDefinition = {
    path: '/',
    absolutePath: basePath,
    component: lazy(() => import('./VideoCategoriesRedirect'))
};

export const categoriesVideosGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    tooltip: "Grid View (G)",
    shortcutKeys: ['g'],
    path: "/grid/:id?",
    absolutePath: `${basePath}/grid/:id?`,
    component: lazy(() => import('../components/media/ViewGrid'))
};

export const categoriesVideosDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    tooltip: "Detail View (W)",
    shortcutKeys: ['w'],
    path: '/detail/:id?',
    absolutePath: `${basePath}/detail/:id?`,
    component: lazy(() => import('../components/media/ViewDetail'))
};

export const categoriesVideosFullscreen: AppRouteDefinition = {
    icon: "i-ic-round-fullscreen",
    name: "Fullscreen View",
    tooltip: "Fullscreen View (F)",
    shortcutKeys: ['f'],
    path: '/fullscreen/:id?',
    absolutePath: `${basePath}/fullscreen/:id?`,
    component: lazy(() => import('../components/media/ViewFullscreen'))
};

export const categoriesVideosMap: AppRouteDefinition = {
    icon: "i-ic-round-map",
    name: "Map View",
    tooltip: "Map View (Z)",
    shortcutKeys: ['z'],
    path: '/map/:id?',
    absolutePath: `${basePath}/map/:id?`,
    component: lazy(() => import('../components/media/ViewMap'))
};

export const categoriesVideosBulkEdit: AppRouteDefinition = {
    icon: "i-ic-round-collections",
    name: "Bulk Edit View",
    tooltip: "Bulk Edit View (B)",
    shortcutKeys: ['b'],
    path: '/bulk-edit',
    absolutePath: `${basePath}/bulk-edit`,
    component: lazy(() => import('../components/media/ViewBulkEdit'))
};

export const categoriesVideos: AppRouteDefinition = {
    icon: undefined as string,
    name: undefined as string,
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import('./VideoCategories')),
    children: [
        categoriesVideosRedirect,
        categoriesVideosGrid,
        categoriesVideosDetail,
        categoriesVideosFullscreen,
        categoriesVideosMap,
        categoriesVideosBulkEdit
    ]
};

export const getVideoCategoryPath = (categoryId: number): string =>
    buildPath(categoriesVideos, {categoryId});

export const getVideoCategoryViewPath = (viewMode: string, categoryId: number, id?: number): string =>
    getVideoCategoryRoutePath(getRouteForViewMode(viewMode), categoryId, id);

export const getVideoCategoryRoutePath = (route: AppRouteDefinition, categoryId: number, id?: number): string =>
    buildPath(route, {categoryId, id});

const getRouteForViewMode = (mode: string): AppRouteDefinition => {
    if(equalsIgnoreCase('grid', mode)) {
        return categoriesVideosGrid;
    }

    if(equalsIgnoreCase('detail', mode)) {
        return categoriesVideosDetail;
    }

    if(equalsIgnoreCase('fullscreen', mode)) {
        return categoriesVideosFullscreen;
    }

    if(equalsIgnoreCase('map', mode)) {
        return categoriesVideosMap;
    }

    if(equalsIgnoreCase('bulkEdit', mode)) {
        return categoriesVideosBulkEdit;
    }

    return categoriesVideosDetail;
};
