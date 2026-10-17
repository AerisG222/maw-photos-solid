import { RouteDisplay } from "../_models/RouteDisplay";

// how the settings area and its pages show up in navigation - the routes are in _routeTree.tsx

export const settingsAppearance: RouteDisplay = {
    icon: "icon-[ic--round-brightness-6]",
    name: "Appearance",
    tooltip: "Appearance Settings"
};

export const settingsBrowsing: RouteDisplay = {
    icon: "icon-[ic--round-density-medium]",
    name: "Browsing",
    tooltip: "Browsing Settings"
};

export const settingsCategories: RouteDisplay = {
    icon: "icon-[ic--round-collections]",
    name: "Categories",
    tooltip: "Category Settings"
};

export const settingsMedia: RouteDisplay = {
    icon: "icon-[ic--round-image]",
    name: "Media",
    tooltip: "Media Settings"
};

export const settingsPeople: RouteDisplay = {
    icon: "icon-[ic--round-people]",
    name: "People",
    tooltip: "People Settings"
};

export const settingsSearch: RouteDisplay = {
    icon: "icon-[ic--round-search]",
    name: "Search",
    tooltip: "Search Settings"
};

export const settingsShortcuts: RouteDisplay = {
    icon: "icon-[ic--round-keyboard]",
    name: "Shortcuts",
    tooltip: "Keyboard Shortcuts"
};

export const settings: RouteDisplay = {
    icon: "icon-[ic--round-settings]",
    name: "Settings",
    helpText:
        "Adjust all settings from one screen to optimize your experience. Many of these settings are also available throughout the application, primarily in context sensitive toolbars, often with support for keyboard control."
};
