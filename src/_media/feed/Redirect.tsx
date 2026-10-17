import { Component } from "solid-js";
import { Navigate } from "@tanstack/solid-router";

import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";
import { useFeedSubject } from "./_subject";
import { feedCategoriesLink, feedGridLink } from "./_routes";

/*
   A feed opens on whatever was last chosen: the listing from the switch in its
   toolbar. Both are settings, which only a component can read - which is why
   this is a component and not a redirect on the route. The route has already
   made sure the subject is an id.

   The favorites filter is applied here only for the categories listing. The
   media pages settle their own filter as they open, where the shuffle seed is
   decided too, and arriving with one already set would make them skip it.
*/
const Redirect: Component = () => {
    const [area] = useAreaSettingsContext();
    const { subject } = useFeedSubject();

    return (
        <Navigate
            {...(area.feedListing === "categories"
                ? feedCategoriesLink(subject(), area.feedFavoritesOnly)
                : feedGridLink(subject()))}
            replace
        />
    );
};

export default Redirect;
