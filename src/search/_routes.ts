import { RouteDisplay } from "../_models/RouteDisplay";

// how the search area and its views show up in navigation - the routes are in _routeTree.tsx

export const searchGrid: RouteDisplay = {
    icon: "icon-[ic--round-apps]",
    name: "Grid",
    tooltip: "Grid View"
};

export const searchList: RouteDisplay = {
    icon: "icon-[ic--round-format-list-bulleted]",
    name: "List",
    tooltip: "List View"
};

export const search: RouteDisplay = {
    icon: "icon-[ic--round-search]",
    name: "Search",
    helpText: "Search photo and video categories."
};
