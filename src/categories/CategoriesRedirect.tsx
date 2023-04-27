import { useLocation, useNavigate } from '@solidjs/router';
import { Component } from "solid-js";

import { buildPath } from '../models/RouteUtils';
import { useCategoryPageSettingsContext } from '../contexts/CategoryPageSettingsContext';
import { useCategoryFilterSettingsContext } from '../contexts/CategoryFilterSettingsContext';
import { buildSearch, getRouteForViewMode } from './_routes';

const CategoriesRedirect: Component = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [settings] = useCategoryPageSettingsContext();
    const [filterState] = useCategoryFilterSettingsContext();

    if(location.pathname.endsWith('/categories')) {
        const route = getRouteForViewMode(settings.viewMode);
        const search = buildSearch(filterState.yearFilter, filterState.typeFilter);
        navigate(buildPath(route, undefined, search));
    }

    return <></>;
};

export default CategoriesRedirect;
