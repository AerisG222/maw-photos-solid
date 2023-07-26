import { lazy } from 'solid-js';
import { AppRouteDefinition, AreaAbout } from '../_models/AppRouteDefinition';
import { routeMatch } from '../_models/utils/RouteUtils';

const basePath = "/about";

export const aboutRedirect: AppRouteDefinition = {
    path: '/',
    absolutePath: basePath,
    component: lazy(() => import('./AboutRedirect'))
};

export const aboutHelp: AppRouteDefinition = {
    icon: "i-ic-round-help",
    name: "Help",
    path: "/help",
    absolutePath: `${basePath}/help`,
    component: lazy(() => import('./ViewHelp'))
};

export const aboutReleaseNotes: AppRouteDefinition = {
    icon: "i-ic-round-info",
    name: "Release Notes",
    path: "/release-notes",
    absolutePath: `${basePath}/release-notes`,
    component: lazy(() => import('./ViewReleaseNotes'))
};

export const aboutAndroid: AppRouteDefinition = {
    icon: "i-ic-android",
    name: "Android Application",
    path: "/android",
    absolutePath: `${basePath}/android`,
    component: lazy(() => import('./ViewAndroid'))
};

export const about: AppRouteDefinition = {
    icon: "i-ic-round-help-outline",
    name: "About",
    helpText: "View help and release notes for this application.",
    path: basePath,
    absolutePath: basePath,
    component: lazy(() => import('./AboutLayout')),
    doesPathMatch: path => routeMatch(path, basePath, AreaAbout),
    children: [
        aboutRedirect,
        aboutHelp,
        aboutReleaseNotes,
        aboutAndroid,
    ]
};
