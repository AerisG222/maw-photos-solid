import { lazy } from 'solid-js'
import { categories } from '../categories/_routes'
import { AppRouteDefinition, buildPath } from '../models/AppRouteDefinition'
import { equalsIgnoreCase } from '../models/Utils'

const basePath = `${categories.absolutePath}/photos/:categoryId`;

export const categoriesPhotosRedirect: AppRouteDefinition = {
    path: '/',
    absolutePath: basePath,
    component: lazy(() => import('./PhotoCategoriesRedirect'))
}

export const categoriesPhotosGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: "/grid/:photoId?",
    absolutePath: `${basePath}/grid/:photoId?`,
    component: lazy(() => import('./ViewGrid'))
}

export const categoriesPhotosDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    path: 'detail',
    absolutePath: `${basePath}/detail`,
    component: lazy(() => import('./ViewDetail'))
}

export const categoriesPhotosFullscreen: AppRouteDefinition = {
    icon: "i-ic-round-fullscreen",
    name: "Fullscreen View",
    path: 'fullscreen',
    absolutePath: `${basePath}/fullscreen`,
    component: lazy(() => import('./ViewFullscreen'))
}

export const categoriesPhotosMap: AppRouteDefinition = {
    icon: "i-ic-round-map",
    name: "Map View",
    path: '/map',
    absolutePath: `${basePath}/map`,
    component: lazy(() => import('./ViewMap'))
}

export const categoriesPhotosBulkEdit: AppRouteDefinition = {
    icon: "i-ic-round-collections",
    name: "Bulk Edit View",
    path: '/bulk-edit',
    absolutePath: `${basePath}/bulk-edit`,
    component: lazy(() => import('./ViewBulkEdit'))
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

export const getPhotoCategoryViewPath = (viewMode: string, categoryId: number): string =>
    buildPath(getRouteForViewMode(viewMode), {categoryId: categoryId});

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
        return categoriesPhotosMap.path;
    }

    if(equalsIgnoreCase('bulkEdit', mode)) {
        return categoriesPhotosBulkEdit;
    }

    return categoriesPhotosGrid;
}
