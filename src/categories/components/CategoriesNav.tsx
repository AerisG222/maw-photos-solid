import { Component } from "solid-js";
import { linkOptions } from "@tanstack/solid-router";

import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";
import { categoriesGrid, categoriesList } from "../_routes";
import { categoriesGridRoute, categoriesListRoute } from "../_routeTree";

import NavGroup from "../../_components/toolbar/NavGroup";

// how many entries this holds, so a toolbar putting more after it numbers on from here
export const CATEGORIES_NAV_COUNT = 2;

/*
   The categories area's two views. Its own component because two toolbars draw
   it: the area's own, and the media toolbar the grid wears while browsing
   every category's photos, where it sits ahead of everything else.
*/
const CategoriesNav: Component = () => {
    const [area, { setCategoriesView }] = useAreaSettingsContext();

    return (
        <NavGroup
            entries={[
                {
                    route: categoriesGrid,
                    link: linkOptions({
                        to: categoriesGridRoute.to,
                        search: { year: area.categoryYearFilter }
                    }),
                    clickHandler: () => setCategoriesView("grid")
                },
                {
                    route: categoriesList,
                    link: linkOptions({
                        to: categoriesListRoute.to,
                        search: { year: area.categoryYearFilter }
                    }),
                    clickHandler: () => setCategoriesView("list")
                }
            ]}
        />
    );
};

export default CategoriesNav;
