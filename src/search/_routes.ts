import { lazy } from 'solid-js'
import { AppRouteDefinition } from '../models/AppRouteDefinition'

export const search: AppRouteDefinition = {
    icon: "i-ic-round-search",
    name: "Search",
    path: "/search",
    component: lazy(() => import('./Search'))
}

export const searchGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: `${search.path}/grid`,
    component: lazy(() => import('./ViewGrid'))
}

export const searchList: AppRouteDefinition = {
    icon: "i-ic-round-format-list-bulleted",
    name: "List View",
    path: `${search.path}/list`,
    component: lazy(() => import('./ViewList'))
}

export const searchRoutes = [
    search,
    searchGrid,
    searchList
];
