import { Component, createEffect } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { useRouteDetailContext } from "../_contexts/RouteDetailContext";
import { AreaCategories, AreaRandom } from "../_models/AppRouteDefinition";
import { MediaView } from "./models/MediaView";
import { getMediaPathByView } from "./models/RouteHelpers";

const Redirect: Component = () => {
    const navigate = useNavigate();
    const [settings] = useMediaPageSettingsContext();
    const [routeContext] = useRouteDetailContext();
    const params = useParams();

    const categoryRedirect = () => {
        navigate(getMediaPathByView(settings.viewMode as MediaView, params.categoryId as Uuid), {
            replace: true
        });
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
