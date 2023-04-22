import { lazy } from 'solid-js'
import { AppRouteDefinition } from '../models/AppRouteDefinition'
import { equalsIgnoreCase } from '../models/Utils'

const basePath = "/search";

export const searchRedirect: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    component: lazy(() => import('./SearchRedirect'))
}

export const searchGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: "/grid",
    absolutePath: `${basePath}/grid`,
    component: lazy(() => import('./ViewGrid'))
}

export const searchList: AppRouteDefinition = {
    icon: "i-ic-round-format-list-bulleted",
    name: "List View",
    path: "/list",
    absolutePath: `${basePath}/list`,
    component: lazy(() => import('./ViewList'))
}

export const search: AppRouteDefinition = {
    icon: "i-ic-round-search",
    name: "Search",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import('./Search')),
    children: [
        searchRedirect,
        searchGrid,
        searchList
    ]
}

export const searchRoutes = [
    search
];

export const getPathForViewMode = (mode: string): string => {
    if(equalsIgnoreCase('grid', mode)) {
        return searchGrid.absolutePath;
    }

    if(equalsIgnoreCase('list', mode)) {
        return searchList.absolutePath;
    }

    return searchGrid.absolutePath;
}
