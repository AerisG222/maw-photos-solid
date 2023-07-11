import { lazy } from 'solid-js';

import { categories } from '../categories/_routes';
import { AppRouteDefinition } from '../models/AppRouteDefinition';
import { MediaView, MediaViewAll, MediaViewModeBulkEdit, MediaViewModeDetail, MediaViewModeFullscreen, MediaViewModeGrid, MediaViewModeMap, buildMediaRoutes } from '../components/media/_routes';
import { buildPath } from '../models/utils/RouteUtils';

const basePath = `${categories.absolutePath}/videos/:categoryId`;
const mediaRoutes = buildMediaRoutes(basePath, MediaViewAll);

export const categoriesVideosGrid = mediaRoutes[MediaViewModeGrid];
export const categoriesVideosDetail = mediaRoutes[MediaViewModeDetail];
export const categoriesVideosFullscreen = mediaRoutes[MediaViewModeFullscreen];
export const categoriesVideosMap = mediaRoutes[MediaViewModeMap];
export const categoriesVideosBulkEdit = mediaRoutes[MediaViewModeBulkEdit];

export const categoriesVideosRedirect: AppRouteDefinition = {
    path: '/',
    absolutePath: basePath,
    component: lazy(() => import('./VideoCategoriesRedirect'))
};

export const categoriesVideos: AppRouteDefinition = {
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

export const getVideoCategoryViewPath = (viewMode: MediaView, categoryId: number, id?: number): string =>
    getVideoCategoryRoutePath(getRouteForViewMode(viewMode), categoryId, id);

export const getVideoCategoryRoutePath = (route: AppRouteDefinition, categoryId: number, id?: number): string =>
    buildPath(route, {categoryId, id});

const getRouteForViewMode = (mode: MediaView): AppRouteDefinition => mediaRoutes[mode];
