import { lazy } from 'solid-js';
import { categories } from '../categories/_routes';
import { AppRouteDefinition } from '../models/AppRouteDefinition';

export const categoriesVideos: AppRouteDefinition = {
    icon: undefined as string,
    name: undefined as string,
    path: `${categories.path}/videos`,
    component: lazy(() => import('./VideoCategories'))
}

export const categoriesVideosRoutes = [
    categoriesVideos
];
