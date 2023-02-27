import { lazy } from 'solid-js'
import { AppRouteDefinition } from '../models/AppRouteDefinition'

export const random: AppRouteDefinition = {
    icon: "i-ic-round-shuffle",
    name: "Random",
    path: "/random",
    component: lazy(() => import('./Random'))
}

export const randomGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: `${random}/grid`,
    component: lazy(() => import('./ViewGrid'))
}

export const randomDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    path: `${random}/detail`,
    component: lazy(() => import('./ViewDetail'))
}

export const randomFullscreen: AppRouteDefinition = {
    icon: "i-ic-round-fullscreen",
    name: "Fullscreen View",
    path: `${random}/fullscreen`,
    component: lazy(() => import('./ViewFullscreen'))
}

export const randomRoutes = [
    random,
    randomGrid,
    randomDetail,
    randomFullscreen
];
