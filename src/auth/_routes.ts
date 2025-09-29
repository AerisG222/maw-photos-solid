import { lazy } from "solid-js";

import { AppRouteDefinition } from "../_models/AppRouteDefinition";

const basePath = "/auth";

export const loginPage: AppRouteDefinition = {
    path: "/login",
    absolutePath: `${basePath}/login`,
    name: "Login",
    component: lazy(() => import("./Login"))
};

export const logout: AppRouteDefinition = {
    path: "/logout",
    absolutePath: `${basePath}/logout`,
    name: "Logout",
    component: lazy(() => import("./Logout"))
};

export const inactive: AppRouteDefinition = {
    path: "/inactive",
    absolutePath: `${basePath}/inactive`,
    name: "Inactive",
    component: lazy(() => import("./Inactive"))
};

export const login: AppRouteDefinition = {
    path: basePath,
    absolutePath: basePath,
    name: "Auth",
    children: [loginPage, logout, inactive]
};
