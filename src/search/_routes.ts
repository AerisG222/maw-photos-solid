import { lazy } from "solid-js";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { equalsIgnoreCase } from "../_models/utils/StringUtils";

const basePath = "/search";

export const searchRedirect: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    name: "Redirect",
    component: lazy(() => import("./Redirect"))
};

export const searchGrid: AppRouteDefinition = {
    icon: "icon-[ic--outline-apps]",
    name: "Grid",
    tooltip: "Grid View",
    path: "/grid",
    absolutePath: `${basePath}/grid`,
    component: lazy(() => import("./Grid"))
};

export const searchList: AppRouteDefinition = {
    icon: "icon-[ic--round-format-list-bulleted]",
    name: "List",
    tooltip: "List View",
    path: "/list",
    absolutePath: `${basePath}/list`,
    component: lazy(() => import("./List"))
};

export const search: AppRouteDefinition = {
    icon: "icon-[ic--round-search]",
    name: "Search",
    helpText: "Search photo and video categories.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("./Layout")),
    children: [searchRedirect, searchGrid, searchList]
};

export const getPathForViewMode = (mode: string): string => {
    if (equalsIgnoreCase("grid", mode)) {
        return searchGrid.absolutePath;
    }

    if (equalsIgnoreCase("list", mode)) {
        return searchList.absolutePath;
    }

    return searchGrid.absolutePath;
};
