import About from './about/About';
import Home from './home/Home';
import PhotoCategories from './photo-categories/PhotoCategories';
import PhotoCategoriesBulkEdit from './photo-categories/PhotoCategoriesBulkEdit';
import PhotoCategoriesDetail from './photo-categories/PhotoCategoriesDetail';
import PhotoCategoriesFullscreen from './photo-categories/PhotoCategoriesFullscreen';
import PhotoCategoriesGrid from './photo-categories/PhotoCategoriesGrid';
import PhotoCategoriesMap from './photo-categories/PhotoCategoriesMap';
import Random from './random/Random';
import RandomDetail from './random/RandomDetail';
import RandomFullscreen from './random/RandomFullscreen';
import RandomGrid from './random/RandomGrid';
import Search from './search/Search';
import SearchGrid from './search/SearchGrid';
import SearchList from './search/SearchList';
import Settings from './settings/Settings';
import SettingsApplication from './settings/SettingsApplication';
import SettingsCategories from './settings/SettingsCategories';
import SettingsPhotos from './settings/SettingsPhotos';
import SettingsRandom from './settings/SettingsRandom';
import SettingsSearch from './settings/SettingsSearch';
import SettingsVideos from './settings/SettingsVideos';
import Stats from './stats/Stats';
import StatsCombined from './stats/StatsCombined';
import StatsPhotos from './stats/StatsPhotos';
import StatsVideos from './stats/StatsVideos';
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
