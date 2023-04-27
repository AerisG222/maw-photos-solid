import { lazy } from 'solid-js';
import { AppRouteDefinition } from '../models/AppRouteDefinition';
import { equalsIgnoreCase } from '../models/utils/StringUtils';
import { YearFilterIdType } from '../models/YearFilter';
import { CategoryTypeFilterIdType } from '../models/CategoryTypeFilter';

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
    helpText: "Browse photos and videos by year and category.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import('./Categories')),
    children: [
        categoriesRedirect,
        categoriesGrid,
        categoriesList
    ]
}

export const getRouteForViewMode = (mode: string) => {
    if(equalsIgnoreCase('list', mode)) {
        return categoriesList;
    }

    return categoriesGrid;
}

export const buildSearch = (year: YearFilterIdType, type: CategoryTypeFilterIdType) => {
    return {year: year, type: type};
}
