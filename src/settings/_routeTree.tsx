import { createRoute, lazyRouteComponent, redirect } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";

// a group with no screen of its own - each page is one setting area
export const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "settings"
});

// opens on the category settings, the ones most people come for
const settingsIndexRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "/",
    beforeLoad: () => {
        throw redirect({ to: settingsCategoriesRoute.to, replace: true });
    }
});

export const settingsAppearanceRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "appearance",
    component: lazyRouteComponent(() => import("./Appearance"))
});

export const settingsBrowsingRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "browsing",
    component: lazyRouteComponent(() => import("./Browsing"))
});

export const settingsCategoriesRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "categories",
    component: lazyRouteComponent(() => import("./Categories"))
});

export const settingsMediaRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "media",
    component: lazyRouteComponent(() => import("./Media"))
});

export const settingsPeopleRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "people",
    component: lazyRouteComponent(() => import("./People"))
});

export const settingsSearchRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "search",
    component: lazyRouteComponent(() => import("./Search"))
});

export const settingsShortcutsRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "shortcuts",
    component: lazyRouteComponent(() => import("./Shortcuts"))
});

export const settingsRouteTree = settingsRoute.addChildren([
    settingsIndexRoute,
    settingsAppearanceRoute,
    settingsBrowsingRoute,
    settingsCategoriesRoute,
    settingsMediaRoute,
    settingsPeopleRoute,
    settingsSearchRoute,
    settingsShortcutsRoute
]);
