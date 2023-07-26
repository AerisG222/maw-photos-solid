import { lazy } from 'solid-js'
import { AppRouteDefinition, AreaSearch } from '../_models/AppRouteDefinition'
import { equalsIgnoreCase } from '../_models/utils/StringUtils'
import { routeMatch } from '../_models/utils/RouteUtils';

const basePath = "/search";

export const searchRedirect: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    component: lazy(() => import('./SearchRedirect'))
};

export const searchGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: "/grid",
    absolutePath: `${basePath}/grid`,
    component: lazy(() => import('./ViewGrid'))
};

export const searchList: AppRouteDefinition = {
    icon: "i-ic-round-format-list-bulleted",
    name: "List View",
    path: "/list",
    absolutePath: `${basePath}/list`,
    component: lazy(() => import('./ViewList'))
};

export const search: AppRouteDefinition = {
    icon: "i-ic-round-search",
    name: "Search",
    helpText: "Search photo and video categories.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import('./Search')),
    doesPathMatch: path => routeMatch(path, basePath, AreaSearch),
    children: [
        searchRedirect,
        searchGrid,
        searchList
    ]
};

export const getPathForViewMode = (mode: string): string => {
    if(equalsIgnoreCase('grid', mode)) {
        return searchGrid.absolutePath;
    }

    if(equalsIgnoreCase('list', mode)) {
        return searchList.absolutePath;
    }

    return searchGrid.absolutePath;
};
