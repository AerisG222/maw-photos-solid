import { lazy } from 'solid-js'
import { AppRouteDefinition } from '../models/AppRouteDefinition'

export const stats: AppRouteDefinition = {
    icon: "i-ic-round-bar-chart",
    name: "Statistics",
    path: "/stats",
    component: lazy(() => import('./Stats'))
}

export const statsPhotos: AppRouteDefinition = {
    icon: "i-ic-outline-photo-camera",
    name: "Photo Stats",
    path: `${stats.path}/photos`,
    component: lazy(() => import('./ViewPhotos'))
}

export const statsVideos: AppRouteDefinition = {
    icon: "i-ic-round-videocam",
    name: "Video Stats",
    path: `${stats.path}/videos`,
    component: lazy(() => import('./ViewVideos'))
}

export const statsCombined: AppRouteDefinition = {
    icon: "i-ic-round-functions",
    name: "Combined Stats",
    path: `${stats.path}/combined`,
    component: lazy(() => import('./ViewCombined'))
}

export const statsRoutes = [
    stats,
    statsPhotos,
    statsVideos,
    statsCombined
];
