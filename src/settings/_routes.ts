import { lazy } from "solid-js";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";

const basePath = "/settings";

export const settingsRedirect: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    name: "Redirect",
    component: lazy(() => import("./Redirect"))
};

export const settingsCategories: AppRouteDefinition = {
    icon: "icon-[ic--round-collections]",
    name: "Categories",
    tooltip: "Category Settings",
    path: "/categories",
    absolutePath: `${basePath}/categories`,
    component: lazy(() => import("./Categories"))
};

export const settingsMedia: AppRouteDefinition = {
    icon: "icon-[ic--round-image]",
    name: "Media",
    tooltip: "Media Settings",
    path: "/media",
    absolutePath: `${basePath}/media`,
    component: lazy(() => import("./Media"))
};

export const settingsSearch: AppRouteDefinition = {
    icon: "icon-[ic--round-search]",
    name: "Search",
    tooltip: "Search Settings",
    path: "/search",
    absolutePath: `${basePath}/search`,
    component: lazy(() => import("./Search"))
};

export const settings: AppRouteDefinition = {
    icon: "icon-[ic--baseline-settings]",
    name: "Settings",
    helpText:
        "Adjust all settings from one screen to optimize your experience. Many of these settings are also available throughout the application, primarily in context sensitive toolbars, often with support for keyboard control.",
    absolutePath: basePath,
    path: basePath,
    component: lazy(() => import("./Layout")),
    children: [settingsRedirect, settingsCategories, settingsMedia, settingsSearch]
};
