import { lazy } from 'solid-js'
import { AppRouteDefinition } from '../_models/AppRouteDefinition'
import { equalsIgnoreCase } from '../_models/utils/StringUtils'

const basePath = "/random";

export const randomRedirect: AppRouteDefinition = {
    path: '/',
    absolutePath: basePath,
    component: lazy(() => import("./RandomRedirect"))
};

export const randomGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: '/grid',
    absolutePath: `${basePath}/grid`,
    component: lazy(() => import('./ViewGrid'))
};

export const randomDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    path: '/detail',
    absolutePath: `${basePath}/detail`,
    component: lazy(() => import('./ViewDetail'))
};

export const randomFullscreen: AppRouteDefinition = {
    icon: "i-ic-round-fullscreen",
    name: "Fullscreen View",
    path: '/fullscreen',
    absolutePath: `${basePath}/fullscreen`,
    component: lazy(() => import('./ViewFullscreen'))
};

export const random: AppRouteDefinition = {
    icon: "i-ic-round-shuffle",
    name: "Random",
    helpText: "Play though an unending list of random photos.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import('./Random')),
    children: [
        randomRedirect,
        randomGrid,
        randomDetail,
        randomFullscreen
    ]
};

export const getPathForViewMode = (mode: string): string => {
    if(equalsIgnoreCase('grid', mode)) {
        return randomGrid.absolutePath;
    }

    if(equalsIgnoreCase('detail', mode)) {
        return randomDetail.absolutePath;
    }

    if(equalsIgnoreCase('fullscreen', mode)) {
        return randomFullscreen.absolutePath;
    }

    return randomGrid.absolutePath;
};
