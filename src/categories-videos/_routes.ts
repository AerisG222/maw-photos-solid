import { lazy } from 'solid-js';

import { categories } from '../categories/_routes';
import { AppRouteDefinition } from '../models/AppRouteDefinition';
import { buildPath } from '../models/utils/RouteUtils';

const basePath = `${categories.absolutePath}/videos/:categoryId`;

export const categoriesVideosRedirect: AppRouteDefinition = {
    path: '/',
    absolutePath: basePath,
    component: lazy(() => import('./VideoCategoriesRedirect'))
}

export const categoriesVideosDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    path: '/detail/:videoId?',
    absolutePath: `${basePath}/detail/:videoId?`,
    component: lazy(() => import('../components/media/ViewDetail'))
}

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
}

export const getVideoCategoryPath = (categoryId: number): string =>
    buildPath(categoriesVideos, {categoryId: categoryId});

export const getVideoCategoryViewPath = (categoryId: number, videoId?: number): string =>
    buildPath(categoriesVideosDetail, {categoryId, videoId});
