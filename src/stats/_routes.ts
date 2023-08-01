import { lazy } from "solid-js"
import { AppRouteDefinition, AreaStats } from "../_models/AppRouteDefinition"
import { routeMatch } from "../_models/utils/RouteUtils";

const basePath = "/stats";

export const statsRedirect: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    component: lazy(() => import("./StatsRedirect"))
};

export const statsPhotos: AppRouteDefinition = {
    icon: "i-ic-outline-photo-camera",
    name: "Photo Stats",
    path: "/photos",
    absolutePath: `${basePath}/photos`,
    component: lazy(() => import("./ViewPhotos"))
};

export const statsVideos: AppRouteDefinition = {
    icon: "i-ic-round-videocam",
    name: "Video Stats",
    path: "/videos",
    absolutePath: `${basePath}/videos`,
    component: lazy(() => import("./ViewVideos"))
};

export const statsCombined: AppRouteDefinition = {
    icon: "i-ic-round-functions",
    name: "Combined Stats",
    path: "/combined",
    absolutePath: `${basePath}/combined`,
    component: lazy(() => import("./ViewCombined"))
};

export const stats: AppRouteDefinition = {
    icon: "i-ic-round-bar-chart",
    name: "Statistics",
    helpText: "View statistics for all photos and videos.",
    absolutePath: basePath,
    path: basePath,
    component: lazy(() => import("./Stats")),
    doesPathMatch: path => routeMatch(path, basePath, AreaStats),
    children: [
        statsRedirect,
        statsPhotos,
        statsVideos,
        statsCombined
    ]
};
