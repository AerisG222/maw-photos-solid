import { lazy } from "solid-js";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";

export const catchAllRedirect: AppRouteDefinition = {
    absolutePath: "*",
    path: "*",
    name: "Catch All",
    component: lazy(() => import("./Redirect"))
};
