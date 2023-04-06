import { lazy } from 'solid-js';
import { AppRouteDefinition } from '../models/AppRouteDefinition';
import { equalsIgnoreCase } from '../models/Utils';

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

// todo (for all areas): try to consolidate view mode settings with the routes above
export const getPathForViewMode = (mode: string): string => {
    if(equalsIgnoreCase('grid', mode)) {
        return categoriesGrid.path;
    }

    if(equalsIgnoreCase('list', mode)) {
        return categoriesList.path;
    }

    return categoriesGrid.path;
}
