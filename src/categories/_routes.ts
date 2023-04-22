import { lazy } from 'solid-js';
import { AppRouteDefinition } from '../models/AppRouteDefinition';
import { equalsIgnoreCase } from '../models/Utils';

const basePath = '/categories';

export const categoriesRedirect: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    component: lazy(() => import('./CategoriesRedirect'))
}

export const categoriesGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: "/grid",
    absolutePath: `${basePath}/grid`,
    component: lazy(() => import('./ViewGrid'))
}

export const categoriesList: AppRouteDefinition = {
    icon: "i-ic-round-format-list-bulleted",
    name: "List View",
    path: "/list",
    absolutePath: `${basePath}/list`,
    component: lazy(() => import('./ViewList'))
}

export const categories: AppRouteDefinition = {
    icon: "i-ic-round-home",
    name: "Categories",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import('./Categories')),
    children: [
        categoriesRedirect,
        categoriesGrid,
        categoriesList
    ]
}

export const categoriesRoutes = [
    categories
];

// todo (for all areas): try to consolidate view mode settings with the routes above
export const getPathForViewMode = (mode: string): string => {
    if(equalsIgnoreCase('grid', mode)) {
        return categoriesGrid.absolutePath;
    }

    if(equalsIgnoreCase('list', mode)) {
        return categoriesList.absolutePath;
    }

    return categoriesGrid.absolutePath;
}
