import { Component } from "solid-js";

import { useFaceFeedSettingsContext } from "../../_contexts/settings/FaceFeedSettingsContext";
import { useMediaPageSettingsContext } from "../../_contexts/settings/MediaPageSettingsContext";
import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { feedListingPath, feedMediaListing } from "./_routes";

import ToolbarLink from "../../_components/toolbar/ToolbarLink";

interface Props {
    basePath: string;
    showingCategories: boolean;
    favoritesOnly: boolean;
}

/*
   Moves between the two things a feed can list: the media somebody appears in,
   or the categories they turn up in.

   First in the toolbar, because it decides what everything after it applies to -
   the view links and the filters below only make sense once you know which
   listing you are in.

   It names where it goes rather than where you are, so there is one item rather
   than two, and no second highlighted link pointing at the page you are on.
*/
const ToolbarListing: Component<Props> = props => {
    const [mediaSettings] = useMediaPageSettingsContext();
    const [, { setShowCategories }] = useFaceFeedSettingsContext();

    /*
       Going back to the media returns to whichever view was last used, rather
       than always the grid - the same preference the feed's redirect opens a
       fresh person on, so the two agree.
    */
    const href = () =>
        feedListingPath(
            props.basePath,
            props.showingCategories ? feedMediaListing(mediaSettings.view) : "categories",
            props.favoritesOnly
        );

    const route = (): AppRouteDefinition => ({
        icon: props.showingCategories ? "icon-[ic--round-image]" : "icon-[ic--round-collections]",
        name: props.showingCategories ? "Media" : "Categories",
        tooltip: props.showingCategories ? "Show Media" : "Show Categories",
        shortcutKeys: ["k"],
        path: href(),
        absolutePath: href()
    });

    return (
        <ToolbarLink
            href={href()}
            route={route()}
            // remembered, so the next person or clan opens on the listing this
            // one was left on - the view links do the same for grid vs detail
            clickHandler={() => setShowCategories(!props.showingCategories)}
        />
    );
};

export default ToolbarListing;
