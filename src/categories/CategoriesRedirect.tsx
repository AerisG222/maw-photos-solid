import { useLocation, useNavigate } from "@solidjs/router";
import { Component } from "solid-js";

import { buildPath } from "../_models/utils/RouteUtils";
import { useCategoryPageSettingsContext } from "../_contexts/settings/CategoryPageSettingsContext";
import { useCategoryFilterSettingsContext } from "../_contexts/settings/CategoryFilterSettingsContext";
import { buildSearch, getRouteForViewMode } from "./_routes";

const CategoriesRedirect: Component = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [settings] = useCategoryPageSettingsContext();
    const [filterState] = useCategoryFilterSettingsContext();

    const updateSearchFromUrl = (search: any, querystring: string) => {
        const searchParams = new URLSearchParams(querystring);
        const yearParam = searchParams.get("year");

        if (!yearParam) {
            return;
        }

        search.year = parseInt(searchParams.get("year")!, 10);
    };

    if (location.pathname.endsWith("/categories")) {
        const route = getRouteForViewMode(settings.viewMode);
        const search = buildSearch(filterState.yearFilter);

        if (location.search) {
            updateSearchFromUrl(search, location.search);
        }

        navigate(buildPath(route, undefined, search));
    }

    return <></>;
};

export default CategoriesRedirect;
