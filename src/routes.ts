import { lazy } from "solid-js";

const About = lazy(() => import('./about/About'));
const Home = lazy(() => import('./home/Home'));
const PhotoCategories = lazy(() => import('./photo-categories/PhotoCategories'));
const PhotoCategoriesBulkEdit = lazy(() => import('./photo-categories/PhotoCategoriesBulkEdit'));
const PhotoCategoriesDetail = lazy(() => import('./photo-categories/PhotoCategoriesDetail'));
const PhotoCategoriesFullscreen = lazy(() => import('./photo-categories/PhotoCategoriesFullscreen'));
const PhotoCategoriesGrid = lazy(() => import('./photo-categories/PhotoCategoriesGrid'));
const PhotoCategoriesMap = lazy(() => import('./photo-categories/PhotoCategoriesMap'));
const Random = lazy(() => import('./random/Random'));
const RandomDetail = lazy(() => import('./random/RandomDetail'));
const RandomFullscreen = lazy(() => import('./random/RandomFullscreen'));
const RandomGrid = lazy(() => import('./random/RandomGrid'));
const Search = lazy(() => import('./search/Search'));
const SearchGrid = lazy(() => import('./search/SearchGrid'));
const SearchList = lazy(() => import('./search/SearchList'));
const Settings = lazy(() => import('./settings/Settings'));
const SettingsApplication = lazy(() => import('./settings/SettingsApplication'));
const SettingsCategories = lazy(() => import('./settings/SettingsCategories'));
const SettingsPhotos = lazy(() => import('./settings/SettingsPhotos'));
const SettingsRandom = lazy(() => import('./settings/SettingsRandom'));
const SettingsSearch = lazy(() => import('./settings/SettingsSearch'));
const SettingsVideos = lazy(() => import('./settings/SettingsVideos'));
const Stats = lazy(() => import('./stats/Stats'));
const StatsCombined = lazy(() => import('./stats/StatsCombined'));
const StatsPhotos = lazy(() => import('./stats/StatsPhotos'));
const StatsVideos = lazy(() => import('./stats/StatsVideos'));
const VideoCategories = lazy(() => import('./video-categories/VideoCategories'));

export const home = {
    icon: "i-ic-round-home",
    name: "Home",
    path: "/",
    component: Home
}

export const search = {
    icon: "i-ic-round-search",
    name: "Search",
    path: "/search",
    component: Search
}

export const random = {
    icon: "i-ic-round-shuffle",
    name: "Random",
    path: "/random",
    component: Random
}

export const stats = {
    icon: "i-ic-round-bar-chart",
    name: "Statistics",
    path: "/stats",
    component: Stats
}

export const about = {
    icon: "i-ic-round-help-outline",
    name: "About",
    path: "/about",
    component: About
}

export const settings = {
    icon: "i-ic-baseline-settings",
    name: "Settings",
    path: "/settings",
    component: Settings
}

export const appRoutes = [
    home,
    search,
    random,
    stats,
    about,

    // dummy routes for now to simplify building out ui
    settings,
    {
        path: '/photo-categories',
        component: PhotoCategories
    },
    settings,
    {
        path: '/photo-categories/grid',
        component: PhotoCategoriesGrid
    },
    settings,
    {
        path: '/photo-categories/detail',
        component: PhotoCategoriesDetail
    },
    settings,
    {
        path: '/photo-categories/fullscreen',
        component: PhotoCategoriesFullscreen
    },
    settings,
    {
        path: '/photo-categories/map',
        component: PhotoCategoriesMap
    },
    {
        path: '/photo-categories/bulk-edit',
        component: PhotoCategoriesBulkEdit
    },

    {
        path: '/video-categories',
        component: VideoCategories
    },

    {
        path: '/search/grid',
        component: SearchGrid
    },
    {
        path: '/search/list',
        component: SearchList
    },

    {
        path: '/random/grid',
        component: RandomGrid
    },
    {
        path: '/random/detail',
        component: RandomDetail
    },
    {
        path: '/random/Fullscreen',
        component: RandomFullscreen
    },

    {
        path: '/stats/photos',
        component: StatsPhotos
    },
    {
        path: '/stats/videos',
        component: StatsVideos
    },
    {
        path: '/stats/combined',
        component: StatsCombined
    },

    {
        path: '/settings/application',
        component: SettingsApplication
    },
    {
        path: '/settings/categories',
        component: SettingsCategories
    },
    {
        path: '/settings/photos',
        component: SettingsPhotos
    },
    {
        path: '/settings/videos',
        component: SettingsVideos
    },
    {
        path: '/settings/search',
        component: SettingsSearch
    },
    {
        path: '/settings/random',
        component: SettingsRandom
    }
];
