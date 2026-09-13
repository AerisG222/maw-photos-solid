import { Component } from "solid-js";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";
import { useNavigate, useParams } from "@solidjs/router";

import { useMediaSettingsContext } from "../../_contexts/settings/MediaSettingsContext";
import { isUuid } from "../../_models/Uuid";
import { people } from "../../people/_routes";
import { places } from "../../places/_routes";
import {
    clanFeedBasePath,
    feedListingPath,
    feedMediaListing,
    personFeedBasePath,
    placeFeedBasePath
} from "./_routes";

const Redirect: Component = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [mediaSettings] = useMediaSettingsContext();
    const [area] = useAreaSettingsContext();

    /*
       A clan lives under /people/clans/{id}, so /people/clans on its own matches
       the person feed with "clans" as the id - and redirecting it would bounce
       between the two patterns forever. Anything that is not an id goes back to
       the picker it came from instead.

       A place cannot land here without an id - the segment after it is what
       distinguishes its feed from the drill-down - but it is checked all the same,
       because a typed url is a typed url.
    */
    const id = params.clanId ?? params.placeId ?? params.personId;

    if (!isUuid(id)) {
        navigate(params.placeId ? places.absolutePath : people.absolutePath, { replace: true });
    } else {
        const basePath = params.clanId
            ? clanFeedBasePath(params.clanId)
            : params.placeId
              ? placeFeedBasePath(params.placeId)
              : personFeedBasePath(params.personId!);

        /*
           A feed opens on whatever was last chosen: the listing from the switch
           in its toolbar, and - for the media - the view from the links beside
           it. The same two preferences those controls write, read back here.

           The favorites filter is applied only for the categories listing. The
           media pages settle their own query string on mount, where the shuffle
           seed is decided too, and arriving with `f` already set would make them
           skip it.
        */
        navigate(
            area.feedListing === "categories"
                ? feedListingPath(basePath, "categories", area.feedFavoritesOnly)
                : feedListingPath(basePath, feedMediaListing(mediaSettings.view), false),
            { replace: true }
        );
    }

    return <></>;
};

export default Redirect;
