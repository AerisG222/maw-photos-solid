import { lazy } from "solid-js";

import { AppRouteDefinition, AreaAuth } from "../_models/AppRouteDefinition";
import { routeMatch } from "../_models/utils/RouteUtils";

const basePath = "/login";

export const loginPage: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    component: lazy(() => import("./Login"))
};

export const login: AppRouteDefinition = {
    path: basePath,
    absolutePath: basePath,
    doesPathMatch: path => routeMatch(path, basePath, AreaAuth),
    children: [
        loginPage
    ]
};
