import { lazy } from "solid-js";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";

const basePath = "/stats";

export const statsRedirect: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    name: "Redirect",
    component: lazy(() => import("./Redirect"))
};

export const statsSummary: AppRouteDefinition = {
    name: "Stats Summary",
    path: "/summary",
    absolutePath: `${basePath}/summary`,
    component: lazy(() => import("./Summary"))
};

export const statsYear: AppRouteDefinition = {
    name: "Stats Year",
    path: "/summary/:year",
    absolutePath: `${basePath}/summary/:year`,
    component: lazy(() => import("./Year"))
};

export const stats: AppRouteDefinition = {
    icon: "icon-[ic--round-bar-chart]",
    name: "Statistics",
    helpText: "View statistics for all photos and videos.",
    absolutePath: basePath,
    path: basePath,
    component: lazy(() => import("./Layout")),
    children: [statsRedirect, statsSummary, statsYear]
};
