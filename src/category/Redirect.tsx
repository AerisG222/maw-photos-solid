import { Component } from "solid-js";
import { getRouteApi, Navigate } from "@tanstack/solid-router";

import { useMediaSettingsContext } from "../_contexts/settings/MediaSettingsContext";
import { categoryViewLink } from "./_routes";

const route = getRouteApi("/categories/$categoryYear/$categorySlug");

// a category opens in whichever view was used last - a setting, which only a component can read
const Redirect: Component = () => {
    const [settings] = useMediaSettingsContext();
    const params = route.useParams();

    return (
        <Navigate
            {...categoryViewLink(settings.view, params().categoryYear, params().categorySlug)}
            replace
        />
    );
};

export default Redirect;
