import { lazy } from "solid-js";

import { AppRouteDefinition } from "../_models/AppRouteDefinition";

const basePath = "/login";

export const loginPage: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    name: "Login",
    component: lazy(() => import("./Login"))
};

export const login: AppRouteDefinition = {
    path: basePath,
    absolutePath: basePath,
    name: "Auth",
    children: [loginPage]
};
