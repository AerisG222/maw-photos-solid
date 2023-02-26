import { lazy } from "solid-js";

export const home = {
    icon: "i-ic-round-home",
    name: "Home",
    path: "/",
    component: lazy(() => import('./home/Home'))
}

export const search = {
    icon: "i-ic-round-search",
    name: "Search",
    path: "/search",
    component: lazy(() => import('./search/Search'))
}

export const random = {
    icon: "i-ic-round-shuffle",
    name: "Random",
    path: "/random",
    component: lazy(() => import('./random/Random'))
}

export const stats = {
    icon: "i-ic-round-bar-chart",
    name: "Statistics",
    path: "/stats",
    component: lazy(() => import('./stats/Stats'))
}

export const about = {
    icon: "i-ic-round-help-outline",
    name: "About",
    path: "/about",
    component: lazy(() => import('./about/About'))
}

export const settings = {
    icon: "i-ic-baseline-settings",
    name: "Settings",
    path: "/settings",
    component: lazy(() => import('./settings/Settings'))
}

export const appRoutes = [
    home,
    search,
    random,
    stats,
    about,
    settings,

    // dummy routes for now to simplify building out ui
    {
        path: '/grid',
        component: lazy(() => import('./home/ViewGrid'))
    },
    {
        path: '/list',
        component: lazy(() => import('./home/ViewList'))
    },

    {
        path: '/photo-categories',
        component: lazy(() => import('./photo-categories/PhotoCategories'))
    },
    {
        path: '/photo-categories/grid',
        component: lazy(() => import('./photo-categories/ViewGrid'))
    },
    {
        path: '/photo-categories/detail',
        component: lazy(() => import('./photo-categories/ViewDetail'))
    },
    {
        path: '/photo-categories/fullscreen',
        component: lazy(() => import('./photo-categories/ViewFullscreen'))
    },
    {
        path: '/photo-categories/map',
        component: lazy(() => import('./photo-categories/ViewMap'))
    },
    {
        path: '/photo-categories/bulk-edit',
        component: lazy(() => import('./photo-categories/ViewBulkEdit'))
    },

    {
        path: '/video-categories',
        component: lazy(() => import('./video-categories/VideoCategories'))
    },

    {
        path: '/search/grid',
        component: lazy(() => import('./search/ViewGrid'))
    },
    {
        path: '/search/list',
        component: lazy(() => import('./search/ViewList'))
    },

    {
        path: '/random/grid',
        component: lazy(() => import('./random/ViewGrid'))
    },
    {
        path: '/random/detail',
        component: lazy(() => import('./random/ViewDetail'))
    },
    {
        path: '/random/Fullscreen',
        component: lazy(() => import('./random/ViewFullscreen'))
    },

    {
        path: '/stats/photos',
        component: lazy(() => import('./stats/ViewPhotos'))
    },
    {
        path: '/stats/videos',
        component: lazy(() => import('./stats/ViewVideos'))
    },
    {
        path: '/stats/combined',
        component: lazy(() => import('./stats/ViewCombined'))
    },

    {
        path: '/settings/application',
        component: lazy(() => import('./settings/ViewApplication'))
    },
    {
        path: '/settings/categories',
        component: lazy(() => import('./settings/ViewCategories'))
    },
    {
        path: '/settings/photos',
        component: lazy(() => import('./settings/ViewPhotos'))
    },
    {
        path: '/settings/videos',
        component: lazy(() => import('./settings/ViewVideos'))
    },
    {
        path: '/settings/search',
        component: lazy(() => import('./settings/ViewSearch'))
    },
    {
        path: '/settings/random',
        component: lazy(() => import('./settings/ViewRandom'))
    }
];
