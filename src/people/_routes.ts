import { lazy } from "solid-js";

import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { Uuid } from "../_models/Uuid";

const basePath = "/people";

export const peopleGrid: AppRouteDefinition = {
    icon: "icon-[ic--outline-apps]",
    name: "Grid",
    tooltip: "Grid View",
    path: "/",
    absolutePath: basePath,
    component: lazy(() => import("./Grid"))
};

export const people: AppRouteDefinition = {
    icon: "icon-[ic--round-people]",
    name: "People",
    helpText: "Browse photos and videos by the people that appear in them.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("./Layout")),
    children: [peopleGrid]
};

export const getPersonPath = (id: Uuid) => `${basePath}/${id}`;
