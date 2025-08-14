import { login } from "./auth/_routes";
import { categories } from "./categories/_routes";
import { about } from "./about/_routes";
import { search } from "./search/_routes";
import { stats } from "./stats/_routes";
import { settings } from "./settings/_routes";
import { catchAllRedirect } from "./redirect/_routes";
import { AppRouteDefinition } from "./_models/AppRouteDefinition";
import { categoryMediaRoutes, randomMediaRoutes } from "./media/_routes";

export const appRoutes = [
    login,
    categories,
    categoryMediaRoutes,
    randomMediaRoutes,
    search,
    stats,
    about,
    settings,
    catchAllRedirect
];

const getAllIcons = (routes: AppRouteDefinition[]) => {
    const icons = [];

    for (const route of routes) {
        getIcons(route, icons);
    }

    return icons;
};

const getIcons = (route: AppRouteDefinition, icons: string[]) => {
    if (route.children) {
        for (const childRoute of route.children) {
            getIcons(childRoute, icons);
        }
    }

    if (route.icon) {
        icons.push(route.icon);
    }

    return icons;
};

export const allRouteIcons = new Set(getAllIcons(appRoutes));
