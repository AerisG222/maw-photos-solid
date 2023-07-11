import { lazy } from 'solid-js'

import { categories } from '../categories/_routes'
import { AppRouteDefinition } from '../models/AppRouteDefinition'
import { buildPath } from '../models/utils/RouteUtils'
import { buildMediaRoutes, MediaViewAll, MediaViewModeGrid, MediaViewModeDetail, MediaViewModeFullscreen, MediaViewModeMap, MediaViewModeBulkEdit, MediaView } from '../components/media/_routes'

const basePath = `${categories.absolutePath}/photos/:categoryId`;
const mediaRoutes = buildMediaRoutes(basePath, MediaViewAll);

export const categoriesPhotosGrid = mediaRoutes[MediaViewModeGrid];
export const categoriesPhotosDetail = mediaRoutes[MediaViewModeDetail];
export const categoriesPhotosFullscreen = mediaRoutes[MediaViewModeFullscreen];
export const categoriesPhotosMap = mediaRoutes[MediaViewModeMap];
export const categoriesPhotosBulkEdit = mediaRoutes[MediaViewModeBulkEdit];

export const categoriesPhotosRedirect: AppRouteDefinition = {
    path: '/',
    absolutePath: basePath,
    component: lazy(() => import('./PhotoCategoriesRedirect'))
};

export const categoriesPhotos: AppRouteDefinition = {
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
};

export const getPhotoCategoryPath = (categoryId: number): string =>
    buildPath(categoriesPhotos, {categoryId});

export const getPhotoCategoryViewPath = (viewMode: MediaView, categoryId: number, id?: number): string =>
    getPhotoCategoryRoutePath(getRouteForViewMode(viewMode), categoryId, id);

export const getPhotoCategoryRoutePath = (route: AppRouteDefinition, categoryId: number, id?: number): string =>
    buildPath(route, {categoryId, id});

const getRouteForViewMode = (mode: MediaView): AppRouteDefinition => mediaRoutes[mode];
