import { useLocation, useNavigate } from "@solidjs/router";
import { Component } from "solid-js";

import { buildPath } from "../_models/utils/RouteUtils";
import { useCategoryPageSettingsContext } from "../contexts/settings/CategoryPageSettingsContext";
import { useCategoryFilterSettingsContext } from "../contexts/settings/CategoryFilterSettingsContext";
import { buildSearch, getRouteForViewMode } from "./_routes";

const CategoriesRedirect: Component = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [settings] = useCategoryPageSettingsContext();
    const [filterState] = useCategoryFilterSettingsContext();

    const updateSearchFromUrl = (search: any, querystring: string) => {
        const searchParams = new URLSearchParams(querystring);

        if (searchParams.has("year") && !isNaN(searchParams.get("year"))) {
            search["year"] = parseInt(searchParams.get("year"), 10);
        }

        if (searchParams.has("type")) {
            search["type"] = searchParams.get("type");
        }
    };

    if (location.pathname.endsWith("/categories")) {
        const route = getRouteForViewMode(settings.viewMode);
        const search = buildSearch(filterState.yearFilter, filterState.typeFilter);

        if (location.search) {
            updateSearchFromUrl(search, location.search);
        }

        navigate(buildPath(route, undefined, search));
    }

    return <></>;
};

export default CategoriesRedirect;
