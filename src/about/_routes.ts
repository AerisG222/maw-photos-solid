import { lazy } from "solid-js";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";

const basePath = "/about";

export const aboutRedirect: AppRouteDefinition = {
    path: "/",
    absolutePath: basePath,
    name: "Redirect",
    component: lazy(() => import("./Redirect"))
};

export const aboutHelp: AppRouteDefinition = {
    icon: "icon-[ic--round-help]",
    name: "Help",
    path: "/help",
    absolutePath: `${basePath}/help`,
    component: lazy(() => import("./Help"))
};

export const aboutReleaseNotes: AppRouteDefinition = {
    icon: "icon-[ic--round-info]",
    name: "Releases",
    tooltip: "Release Notes",
    path: "/release-notes",
    absolutePath: `${basePath}/release-notes`,
    component: lazy(() => import("./ReleaseNotes"))
};

export const aboutAndroid: AppRouteDefinition = {
    icon: "icon-[ic--android]",
    name: "Android",
    tooltip: "Android Application",
    path: "/android",
    absolutePath: `${basePath}/android`,
    component: lazy(() => import("./Android"))
};

export const about: AppRouteDefinition = {
    icon: "icon-[ic--round-help-outline]",
    name: "About",
    helpText: "View help and release notes for this application.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import("./Layout")),
    children: [aboutRedirect, aboutHelp, aboutReleaseNotes, aboutAndroid]
};
