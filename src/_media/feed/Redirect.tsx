import { Component } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { useMediaPageSettingsContext } from "../../_contexts/settings/MediaPageSettingsContext";
import { MediaViewDetail, MediaViewFullscreen } from "../../_models/MediaView";
import { isUuid } from "../../_models/Uuid";
import { people } from "../../people/_routes";
import { buildFeedRoutes, clanFeedBasePath, personFeedBasePath, stripMediaParams } from "./_routes";

const Redirect: Component = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [settings] = useMediaPageSettingsContext();

    /*
       Map and bulk edit only make sense within one category, so a preference for
       either lands on the grid here rather than on a view this feed cannot offer.
    */
    const route = () => {
        const basePath = params.clanId
            ? clanFeedBasePath(params.clanId)
            : personFeedBasePath(params.personId!);
        const routes = buildFeedRoutes(basePath);

        switch (settings.view) {
            case MediaViewDetail:
                return routes.detail;
            case MediaViewFullscreen:
                return routes.fullscreen;
            default:
                return routes.grid;
        }
    };

    /*
       A clan lives under /people/clans/{id}, so /people/clans on its own matches
       the person feed with "clans" as the id - and redirecting it would bounce
       between the two patterns forever. Anything that is not an id goes back to
       the picker instead.
    */
    if (!isUuid(params.clanId ?? params.personId)) {
        navigate(people.absolutePath, { replace: true });
    } else {
        navigate(stripMediaParams(route().absolutePath), { replace: true });
    }

    return <></>;
};

export default Redirect;
