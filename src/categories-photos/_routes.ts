import { lazy } from 'solid-js'
import { categories } from '../categories/_routes'
import { AppRouteDefinition } from '../models/AppRouteDefinition'
import { buildPath } from '../models/utils/RouteUtils'
import { equalsIgnoreCase } from '../models/utils/StringUtils'

const basePath = `${categories.absolutePath}/photos/:categoryId`;

export const categoriesPhotosRedirect: AppRouteDefinition = {
    path: '/',
    absolutePath: basePath,
    component: lazy(() => import('./PhotoCategoriesRedirect'))
}

export const categoriesPhotosGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    tooltip: "Grid View (G)",
    shortcutKeys: ['g'],
    path: "/grid/:photoId?",
    absolutePath: `${basePath}/grid/:photoId?`,
    component: lazy(() => import('../components/media/ViewGrid'))
}

export const categoriesPhotosDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    tooltip: "Detail View (W)",
    shortcutKeys: ['w'],
    path: '/detail/:photoId?',
    absolutePath: `${basePath}/detail/:photoId?`,
    component: lazy(() => import('../components/media/ViewDetail'))
}

export const categoriesPhotosFullscreen: AppRouteDefinition = {
    icon: "i-ic-round-fullscreen",
    name: "Fullscreen View",
    tooltip: "Fullscreen View (F)",
    shortcutKeys: ['f'],
    path: '/fullscreen/:photoId?',
    absolutePath: `${basePath}/fullscreen/:photoId?`,
    component: lazy(() => import('../components/media/ViewFullscreen'))
}

export const categoriesPhotosMap: AppRouteDefinition = {
    icon: "i-ic-round-map",
    name: "Map View",
    tooltip: "Map View (Z)",
    shortcutKeys: ['z'],
    path: '/map/:photoId?',
    absolutePath: `${basePath}/map/:photoId?`,
    component: lazy(() => import('../components/media/ViewMap'))
}

export const categoriesPhotosBulkEdit: AppRouteDefinition = {
    icon: "i-ic-round-collections",
    name: "Bulk Edit View",
    tooltip: "Bulk Edit View (B)",
    shortcutKeys: ['b'],
    path: '/bulk-edit',
    absolutePath: `${basePath}/bulk-edit`,
    component: lazy(() => import('../components/media/ViewBulkEdit'))
}

export const categoriesPhotos: AppRouteDefinition = {
    icon: undefined as string,
    name: undefined as string,
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import('./PhotoCategories')),
    children: [
        categoriesPhotosRedirect,
        categoriesPhotosGrid,
        categoriesPhotosDetail,
        categoriesPhotosFullscreen,
        categoriesPhotosMap,
        categoriesPhotosBulkEdit
    ]
}

export const getPhotoCategoryPath = (categoryId: number): string =>
    buildPath(categoriesPhotos, {categoryId: categoryId});

export const getPhotoCategoryViewPath = (viewMode: string, categoryId: number, photoId?: number): string =>
    getPhotoCategoryRoutePath(getRouteForViewMode(viewMode), categoryId, photoId);

export const getPhotoCategoryRoutePath = (route: AppRouteDefinition, categoryId: number, photoId?: number): string =>
    buildPath(route, {categoryId: categoryId, photoId: photoId});

const getRouteForViewMode = (mode: string): AppRouteDefinition => {
    if(equalsIgnoreCase('grid', mode)) {
        return categoriesPhotosGrid;
    }

    if(equalsIgnoreCase('detail', mode)) {
        return categoriesPhotosDetail;
    }

    if(equalsIgnoreCase('fullscreen', mode)) {
        return categoriesPhotosFullscreen;
    }

    if(equalsIgnoreCase('map', mode)) {
        return categoriesPhotosMap;
    }

    if(equalsIgnoreCase('bulkEdit', mode)) {
        return categoriesPhotosBulkEdit;
    }

    return categoriesPhotosGrid;
}
