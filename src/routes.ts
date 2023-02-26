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
    {
        path: '/',
        children: [
            home,
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
                children: [
                    {
                        path: '/',
                        component: lazy(() => import('./photo-categories/PhotoCategories'))
                    },
                    {
                        path: '/grid',
                        component: lazy(() => import('./photo-categories/ViewGrid'))
                    },
                    {
                        path: '/detail',
                        component: lazy(() => import('./photo-categories/ViewDetail'))
                    },
                    {
                        path: '/fullscreen',
                        component: lazy(() => import('./photo-categories/ViewFullscreen'))
                    },
                    {
                        path: '/map',
                        component: lazy(() => import('./photo-categories/ViewMap'))
                    },
                    {
                        path: '/bulk-edit',
                        component: lazy(() => import('./photo-categories/ViewBulkEdit'))
                    },
                ]
            },

            {
                path: '/video-categories',
                component: lazy(() => import('./video-categories/VideoCategories'))
            }
        ]
    },

    {
        path: '/search',
        children: [
            search,
            {
                path: '/grid',
                component: lazy(() => import('./search/ViewGrid'))
            },
            {
                path: '/list',
                component: lazy(() => import('./search/ViewList'))
            }
        ]
    },

    {
        path: '/random',
        children: [
            random,
            {
                path: '/grid',
                component: lazy(() => import('./random/ViewGrid'))
            },
            {
                path: '/detail',
                component: lazy(() => import('./random/ViewDetail'))
            },
            {
                path: '/Fullscreen',
                component: lazy(() => import('./random/ViewFullscreen'))
            }
        ],
    },

    {
        path: '/stats',
        children: [
            stats,
            {
                path: '/photos',
                component: lazy(() => import('./stats/ViewPhotos'))
            },
            {
                path: '/videos',
                component: lazy(() => import('./stats/ViewVideos'))
            },
            {
                path: '/combined',
                component: lazy(() => import('./stats/ViewCombined'))
            }
        ]
    },

    {
        path: '/about',
        children: [
            about
        ]
    },

    {
        path: '/settings',
        children: [
            settings,
            {
                path: '/application',
                component: lazy(() => import('./settings/ViewApplication'))
            },
            {
                path: '/categories',
                component: lazy(() => import('./settings/ViewCategories'))
            },
            {
                path: '/photos',
                component: lazy(() => import('./settings/ViewPhotos'))
            },
            {
                path: '/videos',
                component: lazy(() => import('./settings/ViewVideos'))
            },
            {
                path: '/search',
                component: lazy(() => import('./settings/ViewSearch'))
            },
            {
                path: '/random',
                component: lazy(() => import('./settings/ViewRandom'))
            }
        ]
    }
];
