import { lazy } from "solid-js";

import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { equalsIgnoreCase } from "../_models/utils/StringUtils";
import { Uuid } from "../_models/Uuid";

const basePath = "/categories";

export const categoriesRedirect: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    name: "Redirect",
    component: lazy(() => import("./Redirect"))
};

export const categoriesGrid: AppRouteDefinition = {
    icon: "icon-[ic--outline-apps]",
    name: "Grid",
    tooltip: "Grid View",
    path: "/grid",
    absolutePath: `${basePath}/grid`,
    component: lazy(() => import("./Grid"))
};

export const categoriesList: AppRouteDefinition = {
    icon: "icon-[ic--round-format-list-bulleted]",
    name: "List",
    tooltip: "List View",
    path: "/list",
    absolutePath: `${basePath}/list`,
    component: lazy(() => import("./List"))
};

export const categories: AppRouteDefinition = {
    icon: "icon-[ic--round-home]",
    name: "Categories",
    helpText: "Browse by year and category.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("./Layout")),
    children: [categoriesRedirect, categoriesGrid, categoriesList]
};

export const getRouteForViewMode = (mode: string) => {
    if (equalsIgnoreCase("list", mode)) {
        return categoriesList;
    }

    return categoriesGrid;
};

export const buildSearch = (year?: number | "all") => {
    return { year: year };
};

export const getCategoryPath = (categoryId: Uuid) => `${basePath}/${categoryId}`;
