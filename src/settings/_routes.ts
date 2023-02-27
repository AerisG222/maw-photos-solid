import { lazy } from 'solid-js'
import { AppRouteDefinition } from '../models/AppRouteDefinition'

export const settings: AppRouteDefinition = {
    icon: "i-ic-baseline-settings",
    name: "Settings",
    path: "/settings",
    component: lazy(() => import('./Settings'))
}

export const settingsApplication: AppRouteDefinition = {
    icon: "i-ic-round-home",
    name: "Application",
    path: `${settings.path}/application`,
    component: lazy(() => import('./ViewApplication'))
}

export const settingsCategories: AppRouteDefinition = {
    icon: "i-ic-round-collections",
    name: "Categories",
    path: `${settings.path}/categories`,
    component: lazy(() => import('./ViewCategories'))
}

export const settingsPhotos: AppRouteDefinition = {
    icon: "i-ic-round-image",
    name: "Photos",
    path: `${settings.path}/photos`,
    component: lazy(() => import('./ViewPhotos'))
}

export const settingsVideos: AppRouteDefinition = {
    icon: "i-ic-round-videocam",
    name: "Videos",
    path: `${settings.path}/videos`,
    component: lazy(() => import('./ViewVideos'))
}

export const settingsSearch: AppRouteDefinition = {
    icon: "i-ic-round-search",
    name: "Search",
    path: `${settings.path}/search`,
    component: lazy(() => import('./ViewSearch'))
}

export const settingsRandom: AppRouteDefinition = {
    icon: "i-ic-round-shuffle",
    name: "Random",
    path: `${settings.path}/random`,
    component: lazy(() => import('./ViewRandom'))
}

export const settingsRoutes = [
    settings,
    settingsApplication,
    settingsCategories,
    settingsPhotos,
    settingsVideos,
    settingsSearch,
    settingsRandom
];
