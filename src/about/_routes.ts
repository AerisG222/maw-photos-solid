import { RouteDisplay } from "../_models/RouteDisplay";

// how the about area and its pages show up in navigation - the routes are in _routeTree.tsx

export const aboutHelp: RouteDisplay = {
    icon: "icon-[ic--round-help]",
    name: "Help"
};

export const aboutReleaseNotes: RouteDisplay = {
    icon: "icon-[ic--round-info]",
    name: "Releases",
    tooltip: "Release Notes"
};

export const aboutAndroid: RouteDisplay = {
    icon: "icon-[ic--round-android]",
    name: "Android",
    tooltip: "Android Application"
};

export const about: RouteDisplay = {
    icon: "icon-[ic--round-help-outline]",
    name: "About",
    helpText: "View help and release notes for this application."
};
