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
        throw redirect({ to: "/settings/categories", replace: true });
    }
});

const settingsAppearanceRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "appearance",
    component: lazyRouteComponent(() => import("./Appearance"))
});

const settingsBrowsingRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "browsing",
    component: lazyRouteComponent(() => import("./Browsing"))
});

const settingsCategoriesRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "categories",
    component: lazyRouteComponent(() => import("./Categories"))
});

const settingsMediaRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "media",
    component: lazyRouteComponent(() => import("./Media"))
});

const settingsPeopleRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "people",
    component: lazyRouteComponent(() => import("./People"))
});

const settingsSearchRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: "search",
    component: lazyRouteComponent(() => import("./Search"))
});

const settingsShortcutsRoute = createRoute({
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
