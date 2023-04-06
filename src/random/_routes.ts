import { lazy } from 'solid-js'
import { AppRouteDefinition } from '../models/AppRouteDefinition'
import { equalsIgnoreCase } from '../models/Utils'

export const random: AppRouteDefinition = {
    icon: "i-ic-round-shuffle",
    name: "Random",
    path: "/random",
    component: lazy(() => import('./Random'))
}

export const randomGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: `${random.path}/grid`,
    component: lazy(() => import('./ViewGrid'))
}

export const randomDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    path: `${random.path}/detail`,
    component: lazy(() => import('./ViewDetail'))
}

export const randomFullscreen: AppRouteDefinition = {
    icon: "i-ic-round-fullscreen",
    name: "Fullscreen View",
    path: `${random.path}/fullscreen`,
    component: lazy(() => import('./ViewFullscreen'))
}

export const randomRoutes = [
    random,
    randomGrid,
    randomDetail,
    randomFullscreen
];

export const getPathForViewMode = (mode: string): string => {
    if(equalsIgnoreCase('grid', mode)) {
        return randomGrid.path;
    }

    if(equalsIgnoreCase('detail', mode)) {
        return randomDetail.path;
    }

    if(equalsIgnoreCase('fullscreen', mode)) {
        return randomFullscreen.path;
    }

    return randomGrid.path;
}
