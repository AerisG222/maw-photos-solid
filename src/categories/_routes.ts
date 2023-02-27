import { lazy } from 'solid-js';
import { AppRouteDefinition } from '../models/AppRouteDefinition';

export const categories: AppRouteDefinition = {
    icon: "i-ic-round-home",
    name: "Categories",
    path: "/categories",
    component: lazy(() => import('./Categories'))
}

export const categoriesGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: `${categories.path}/grid`,
    component: lazy(() => import('./ViewGrid'))
}

export const categoriesList: AppRouteDefinition = {
    icon: "i-ic-round-format-list-bulleted",
    name: "List View",
    path: `${categories.path}/list`,
    component: lazy(() => import('./ViewList'))
}

export const categoriesRoutes = [
    categories,
    categoriesGrid,
    categoriesList
];
