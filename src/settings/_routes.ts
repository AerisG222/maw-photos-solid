import { lazy } from 'solid-js'
import { AppRouteDefinition } from '../_models/AppRouteDefinition'

const basePath = "/settings";

export const settingsRedirect: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    component: lazy(() => import('./SettingsRedirect'))
};

export const settingsApplication: AppRouteDefinition = {
    icon: "i-ic-round-home",
    name: "Application",
    path: '/application',
    absolutePath: `${basePath}/application`,
    component: lazy(() => import('./ViewApplication'))
};

export const settingsCategories: AppRouteDefinition = {
    icon: "i-ic-round-collections",
    name: "Categories",
    path: '/categories',
    absolutePath: `${basePath}/categories`,
    component: lazy(() => import('./ViewCategories'))
};

export const settingsPhotos: AppRouteDefinition = {
    icon: "i-ic-round-image",
    name: "Photos",
    path: '/photos',
    absolutePath: `${basePath}/photos`,
    component: lazy(() => import('./ViewPhotos'))
};

export const settingsVideos: AppRouteDefinition = {
    icon: "i-ic-round-videocam",
    name: "Videos",
    path: '/videos',
    absolutePath: `${basePath}/videos`,
    component: lazy(() => import('./ViewVideos'))
};

export const settingsSearch: AppRouteDefinition = {
    icon: "i-ic-round-search",
    name: "Search",
    path: '/search',
    absolutePath: `${basePath}/search`,
    component: lazy(() => import('./ViewSearch'))
};

export const settingsRandom: AppRouteDefinition = {
    icon: "i-ic-round-shuffle",
    name: "Random",
    path: '/random',
    absolutePath: `${basePath}/random`,
    component: lazy(() => import('./ViewRandom'))
};

export const settings: AppRouteDefinition = {
    icon: "i-ic-baseline-settings",
    name: "Settings",
    helpText: "Adjust all settings from one screen to optimize your experience. Many of these settings are also available throughout the application, primarily in context sensitive toolbars, often with support for keyboard control.",
    path: "/settings",
    component: lazy(() => import('./Settings')),
    children: [
        settingsRedirect,
        settingsApplication,
        settingsCategories,
        settingsPhotos,
        settingsVideos,
        settingsSearch,
        settingsRandom
    ]
};
