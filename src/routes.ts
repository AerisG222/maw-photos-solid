import { lazy } from "solid-js";
import { AppRouteDefinition } from './models/AppRouteDefinition';

export const categories: AppRouteDefinition = {
    icon: "i-ic-round-home",
    name: "Categories",
    path: "/categories",
    component: lazy(() => import('./categories/Categories'))
}

export const categoriesGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: `${categories.path}/grid`,
    component: lazy(() => import('./categories/ViewGrid'))
}

export const categoriesList: AppRouteDefinition = {
    icon: "i-ic-round-format-list-bulleted",
    name: "List View",
    path: `${categories.path}/list`,
    component: lazy(() => import('./categories/ViewList'))
}

export const categoriesPhotos: AppRouteDefinition = {
    icon: undefined as string,
    name: undefined as string,
    path: `${categories.path}/photos`,
    component: lazy(() => import('./photo-categories/PhotoCategories'))
}

export const categoriesPhotosGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: `${categoriesPhotos}/grid`,
    component: lazy(() => import('./photo-categories/ViewGrid'))
}

export const categoriesPhotosDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    path: `${categoriesPhotos}/detail`,
    component: lazy(() => import('./photo-categories/ViewDetail'))
}

export const categoriesPhotosFullscreen: AppRouteDefinition = {
    icon: "i-ic-round-fullscreen",
    name: "Fullscreen View",
    path: `${categoriesPhotos}/fullscreen`,
    component: lazy(() => import('./photo-categories/ViewFullscreen'))
}

export const categoriesPhotosMap: AppRouteDefinition = {
    icon: "i-ic-round-map",
    name: "Map View",
    path: `${categoriesPhotos}/map`,
    component: lazy(() => import('./photo-categories/ViewMap'))
}

export const categoriesPhotosBulkEdit: AppRouteDefinition = {
    icon: "i-ic-round-collections",
    name: "Bulk Edit View",
    path: `${categoriesPhotos}/bulk-edit`,
    component: lazy(() => import('./photo-categories/ViewBulkEdit'))
}

export const categoriesVideos: AppRouteDefinition = {
    icon: undefined as string,
    name: undefined as string,
    path: `${categories.path}/videos`,
    component: lazy(() => import('./video-categories/VideoCategories'))
}

export const search: AppRouteDefinition = {
    icon: "i-ic-round-search",
    name: "Search",
    path: "/search",
    component: lazy(() => import('./search/Search'))
}

export const searchGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: `${search}/grid`,
    component: lazy(() => import('./search/ViewGrid'))
}

export const searchList: AppRouteDefinition = {
    icon: "i-ic-round-format-list-bulleted",
    name: "List View",
    path: `${search}/list`,
    component: lazy(() => import('./search/ViewList'))
}

export const random: AppRouteDefinition = {
    icon: "i-ic-round-shuffle",
    name: "Random",
    path: "/random",
    component: lazy(() => import('./random/Random'))
}

export const randomGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: `${random}/grid`,
    component: lazy(() => import('./random/ViewGrid'))
}

export const randomDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    path: `${random}/detail`,
    component: lazy(() => import('./random/ViewDetail'))
}

export const randomFullscreen: AppRouteDefinition = {
    icon: "i-ic-round-fullscreen",
    name: "Fullscreen View",
    path: `${random}/fullscreen`,
    component: lazy(() => import('./random/ViewFullscreen'))
}

export const stats: AppRouteDefinition = {
    icon: "i-ic-round-bar-chart",
    name: "Statistics",
    path: "/stats",
    component: lazy(() => import('./stats/Stats'))
}

export const statsPhotos: AppRouteDefinition = {
    icon: "i-ic-outline-photo-camera",
    name: "Photo Stats",
    path: `${stats.path}/photos`,
    component: lazy(() => import('./stats/ViewPhotos'))
}

export const statsVideos: AppRouteDefinition = {
    icon: "i-ic-round-videocam",
    name: "Video Stats",
    path: `${stats.path}/videos`,
    component: lazy(() => import('./stats/ViewVideos'))
}

export const statsCombined: AppRouteDefinition = {
    icon: "i-ic-round-functions",
    name: "Combined Stats",
    path: `${stats.path}/combined`,
    component: lazy(() => import('./stats/ViewCombined'))
}

export const about: AppRouteDefinition = {
    icon: "i-ic-round-help-outline",
    name: "About",
    path: "/about",
    component: lazy(() => import('./about/About'))
}

export const settings: AppRouteDefinition = {
    icon: "i-ic-baseline-settings",
    name: "Settings",
    path: "/settings",
    component: lazy(() => import('./settings/Settings'))
}

export const settingsApplication: AppRouteDefinition = {
    icon: "i-ic-round-home",
    name: "Application",
    path: `${settings.path}/application`,
    component: lazy(() => import('./settings/ViewApplication'))
}

export const settingsCategories: AppRouteDefinition = {
    icon: "i-ic-round-collections",
    name: "Categories",
    path: `${settings.path}/categories`,
    component: lazy(() => import('./settings/ViewCategories'))
}

export const settingsPhotos: AppRouteDefinition = {
    icon: "i-ic-round-image",
    name: "Photos",
    path: `${settings.path}/photos`,
    component: lazy(() => import('./settings/ViewPhotos'))
}

export const settingsVideos: AppRouteDefinition = {
    icon: "i-ic-round-videocam",
    name: "Videos",
    path: `${settings.path}/videos`,
    component: lazy(() => import('./settings/ViewVideos'))
}

export const settingsSearch: AppRouteDefinition = {
    icon: "i-ic-round-search",
    name: "Search",
    path: `${settings.path}/search`,
    component: lazy(() => import('./settings/ViewSearch'))
}

export const settingsRandom: AppRouteDefinition = {
    icon: "i-ic-round-shuffle",
    name: "Random",
    path: `${settings.path}/random`,
    component: lazy(() => import('./settings/ViewRandom'))
}

export const appRoutes = [
    categories,
    categoriesGrid,
    categoriesList,

    categoriesPhotos,
    categoriesPhotosGrid,
    categoriesPhotosDetail,
    categoriesPhotosFullscreen,
    categoriesPhotosMap,
    categoriesPhotosBulkEdit,

    categoriesVideos,

    search,
    searchGrid,
    searchList,

    random,
    randomGrid,
    randomDetail,
    randomFullscreen,

    stats,
    statsPhotos,
    statsVideos,
    statsCombined,

    about,

    settings,
    settingsApplication,
    settingsCategories,
    settingsPhotos,
    settingsVideos,
    settingsSearch,
    settingsRandom
];
