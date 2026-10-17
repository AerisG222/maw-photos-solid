import { RouteDisplay } from "../_models/RouteDisplay";

// how the categories area and its views show up in navigation - the routes are in _routeTree.tsx

export const categoriesGrid: RouteDisplay = {
    icon: "icon-[ic--round-apps]",
    name: "Grid",
    tooltip: "Grid View"
};

export const categoriesList: RouteDisplay = {
    icon: "icon-[ic--round-format-list-bulleted]",
    name: "List",
    tooltip: "List View"
};

export const categories: RouteDisplay = {
    icon: "icon-[ic--round-home]",
    name: "Categories",
    helpText: "Browse by year and category."
};

/*
   A category's address as plain text, for the one place a link is not followed
   but handed to somebody else - sharing a photograph. Everything that navigates
   builds a typed link to the route instead.
*/
export const getCategoryPath = (year: number, slug: string) => `/categories/${year}/${slug}`;
