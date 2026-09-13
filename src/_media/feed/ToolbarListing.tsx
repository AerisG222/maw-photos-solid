import { Component } from "solid-js";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";

import { useMediaSettingsContext } from "../../_contexts/settings/MediaSettingsContext";
import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { feedListingPath, feedMediaListing } from "./_routes";

import NavGroup from "../../_components/toolbar/NavGroup";

interface Props {
    basePath: string;
    showingCategories: boolean;
    favoritesOnly: boolean;
}

/*
   The two things a feed can list: the media somebody appears in - or that was
   taken somewhere - and the categories holding it.

   Both are always shown, with the one you are in lit, which is how the view links
   below already behave and how the places screen offers the same two listings
   before you are in either. This used to be a single item naming the *other*
   listing; that saved a slot at the cost of the toolbar reading differently
   depending on where you stood, which is exactly the inconsistency it looked
   like.

   First in the toolbar, because it decides what everything after it applies to -
   the view links and the filters below only make sense once you know which
   listing you are in. That is also why it takes the first digits and the view
   links carry on from there.

   Both entries can carry a key now. They could not before: the switch had a
   single letter, `k`, which had to sit on whichever listing you were *not* in,
   because every other letter on this screen was already spoken for.
*/
// what the `leading` slot of the media toolbar holds, so its view links know
// where to start numbering
export const LISTING_NAV_COUNT = 2;
const ToolbarListing: Component<Props> = props => {
    const [mediaSettings] = useMediaSettingsContext();
    const [, { setFeedListing }] = useAreaSettingsContext();

    /*
       Going back to the media returns to whichever view was last used, rather
       than always the grid - the same preference the feed's redirect opens a
       fresh subject on, so the two agree.
    */
    const mediaHref = () =>
        feedListingPath(props.basePath, feedMediaListing(mediaSettings.view), props.favoritesOnly);

    const categoriesHref = () => feedListingPath(props.basePath, "categories", props.favoritesOnly);

    const mediaRoute = (): AppRouteDefinition => ({
        icon: "icon-[ic--round-image]",
        name: "Media",
        tooltip: "Show Media",
        path: mediaHref(),
        absolutePath: mediaHref()
    });

    const categoriesRoute = (): AppRouteDefinition => ({
        icon: "icon-[ic--round-collections]",
        name: "Categories",
        tooltip: "Show Categories",
        path: categoriesHref(),
        absolutePath: categoriesHref()
    });

    return (
        /*
            Told which is current rather than left to the router: the media href
            names whichever view was last used, so on any other view the url and
            the link would disagree and neither would light up.

            The choice is remembered on the way through, so the next subject opens
            on the listing this one was left on - the view links do the same for
            grid against fullscreen.
        */
        <NavGroup
            entries={[
                {
                    route: mediaRoute(),
                    href: mediaHref(),
                    active: !props.showingCategories,
                    clickHandler: () => setFeedListing("media")
                },
                {
                    route: categoriesRoute(),
                    href: categoriesHref(),
                    active: props.showingCategories,
                    clickHandler: () => setFeedListing("categories")
                }
            ]}
        />
    );
};

export default ToolbarListing;
