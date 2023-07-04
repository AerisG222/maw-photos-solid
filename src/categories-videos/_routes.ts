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

export const categoriesVideosDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    path: '/detail/:videoId?',
    absolutePath: `${basePath}/detail/:videoId?`,
    component: lazy(() => import('../components/media/ViewDetail'))
};

export const categoriesVideos: AppRouteDefinition = {
    icon: undefined as string,
    name: undefined as string,
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import('./VideoCategories')),
    children: [
        categoriesVideosRedirect,
        categoriesVideosDetail
    ]
};

export const getVideoCategoryPath = (categoryId: number): string =>
    buildPath(categoriesVideos, {categoryId: categoryId});

export const getVideoCategoryViewPath = (viewMode: string, categoryId: number, videoId?: number): string =>
    getVideoCategoryRoutePath(getRouteForViewMode(viewMode), categoryId, videoId);

export const getVideoCategoryRoutePath = (route: AppRouteDefinition, categoryId: number, videoId?: number): string =>
    buildPath(route, {categoryId: categoryId, videoId: videoId});

const getRouteForViewMode = (mode: string): AppRouteDefinition => {
    // if(equalsIgnoreCase('grid', mode)) {
    //     return categoriesPhotosGrid;
    // }

    if(equalsIgnoreCase('detail', mode)) {
        return categoriesVideosDetail;
    }

    // if(equalsIgnoreCase('fullscreen', mode)) {
    //     return categoriesPhotosFullscreen;
    // }

    // if(equalsIgnoreCase('map', mode)) {
    //     return categoriesPhotosMap;
    // }

    // if(equalsIgnoreCase('bulkEdit', mode)) {
    //     return categoriesPhotosBulkEdit;
    // }

    return categoriesVideosDetail;
};
