import { Component, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { MediaView, getMediaPathByView } from "./_routes";
import { useCategoryContext } from "../_contexts/CategoryContext";
import { useRouteDetailContext } from "../_contexts/RouteDetailContext";
import { AreaCategories, AreaRandom } from "../_models/AppRouteDefinition";

const Redirect: Component = () => {
    const navigate = useNavigate();
    const [categoryContext] = useCategoryContext();
    const [settings] = useMediaPageSettingsContext();
    const [routeContext] = useRouteDetailContext();

    const categoryRedirect = () => {
        const cat = categoryContext.activeCategory;

        if (cat) {
            navigate(getMediaPathByView(settings.viewMode as MediaView, cat.type, cat.id), {
                replace: true
            });
        }
    };

    const randomRedirect = () => {
        navigate("/random/grid", { replace: true });
    };

    createEffect(() => {
        switch (routeContext.area) {
            case AreaCategories:
                categoryRedirect();
                break;
            case AreaRandom:
                randomRedirect();
                break;
        }
    });

    return <></>;
};

export default Redirect;
