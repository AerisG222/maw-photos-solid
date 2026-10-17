import { createRoute, lazyRouteComponent, redirect } from "@tanstack/solid-router";

import { rootRoute } from "../_router/rootRoute";

export const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "about",
    component: lazyRouteComponent(() => import("./Layout"))
});

// the area itself is not a page - it opens on help
const aboutIndexRoute = createRoute({
    getParentRoute: () => aboutRoute,
    path: "/",
    beforeLoad: () => {
        throw redirect({ to: "/about/help", replace: true });
    }
});

const aboutHelpRoute = createRoute({
    getParentRoute: () => aboutRoute,
    path: "help",
    component: lazyRouteComponent(() => import("./Help"))
});

const aboutReleaseNotesRoute = createRoute({
    getParentRoute: () => aboutRoute,
    path: "release-notes",
    component: lazyRouteComponent(() => import("./ReleaseNotes"))
});

const aboutAndroidRoute = createRoute({
    getParentRoute: () => aboutRoute,
    path: "android",
    component: lazyRouteComponent(() => import("./Android"))
});

export const aboutRouteTree = aboutRoute.addChildren([
    aboutIndexRoute,
    aboutHelpRoute,
    aboutReleaseNotesRoute,
    aboutAndroidRoute
]);
