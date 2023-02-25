import About from './about/About';
import Home from './home/Home';
import PhotoCategories from './photo-categories/PhotoCategories';
import PhotoCategoriesBulkEdit from './photo-categories/PhotoCategoriesBulkEdit';
import PhotoCategoriesDetail from './photo-categories/PhotoCategoriesDetail';
import PhotoCategoriesFullscreen from './photo-categories/PhotoCategoriesFullscreen';
import PhotoCategoriesGrid from './photo-categories/PhotoCategoriesGrid';
import PhotoCategoriesMap from './photo-categories/PhotoCategoriesMap';
import Random from './random/Random';
import Search from './search/Search';
import Settings from './settings/Settings';
import Stats from './stats/Stats';
import VideoCategories from './video-categories/VideoCategories';

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
    }
];
