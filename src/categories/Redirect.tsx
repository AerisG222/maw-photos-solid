import { Component } from "solid-js";
import { getRouteApi, Navigate } from "@tanstack/solid-router";

import { useAreaSettingsContext } from "../_contexts/settings/AreaSettingsContext";
import { equalsIgnoreCase } from "../_models/utils/StringUtils";

const route = getRouteApi("/categories");

/*
   The view last used, and the year the address asked for - or, if it asked for
   none, the one last chosen. Both views are settings, which only a component
   can read.
*/
const CategoriesRedirect: Component = () => {
    const [area] = useAreaSettingsContext();
    const search = route.useSearch();

    return (
        <Navigate
            to={
                equalsIgnoreCase("list", area.categoriesView)
                    ? "/categories/list"
                    : "/categories/grid"
            }
            search={{ year: search().year ?? area.categoryYearFilter }}
            replace
        />
    );
};

export default CategoriesRedirect;
