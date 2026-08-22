import { Component } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { MediaViewDetail, MediaViewFullscreen } from "../_models/MediaView";
import { getPersonMediaRoutes, stripMediaParams } from "./_routes";

const Redirect: Component = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [settings] = useMediaPageSettingsContext();

    /*
       Map and bulk edit only make sense within one category, so a preference for
       either lands on the grid here rather than on a view this feed cannot offer.
    */
    const route = () => {
        const routes = getPersonMediaRoutes(params.personId!);

        switch (settings.view) {
            case MediaViewDetail:
                return routes.detail;
            case MediaViewFullscreen:
                return routes.fullscreen;
            default:
                return routes.grid;
        }
    };

    navigate(stripMediaParams(route().absolutePath), { replace: true });

    return <></>;
};

export default Redirect;
