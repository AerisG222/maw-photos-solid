import { useLocation, useNavigate } from "@solidjs/router";
import { useAreaSettingsContext } from "../_contexts/settings/AreaSettingsContext";
import { Component } from "solid-js";

import { buildPath } from "../_models/utils/RouteUtils";
import { buildSearch, getRouteForViewMode } from "./_routes";

const CategoriesRedirect: Component = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [area] = useAreaSettingsContext();

    const updateSearchFromUrl = (search: { year?: number | "all" }, querystring: string) => {
        const searchParams = new URLSearchParams(querystring);
        const yearParam = searchParams.get("year");

        if (!yearParam) {
            return;
        }

        search.year = parseInt(searchParams.get("year")!, 10);
    };

    if (location.pathname.endsWith("/categories")) {
        const route = getRouteForViewMode(area.categoriesView);
        const search = buildSearch(area.categoryYearFilter);

        if (location.search) {
            updateSearchFromUrl(search, location.search);
        }

        navigate(buildPath(route, undefined, search), { replace: true });
    }

    return <></>;
};

export default CategoriesRedirect;
