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
   listing you are in.

   `k` stays on whichever you are not in, so the key still means "switch
   listing". It cannot sit on both: every other letter on this screen is spoken
   for, `p` included - that one plays the slideshow here, while the places screen
   is free to use it for the media listing.
*/
const ToolbarListing: Component<Props> = props => {
    const [mediaSettings] = useMediaPageSettingsContext();
    const [, { setShowCategories }] = useFaceFeedSettingsContext();

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
        shortcutKeys: props.showingCategories ? ["k"] : undefined,
        path: mediaHref(),
        absolutePath: mediaHref()
    });

    const categoriesRoute = (): AppRouteDefinition => ({
        icon: "icon-[ic--round-collections]",
        name: "Categories",
        tooltip: "Show Categories",
        shortcutKeys: props.showingCategories ? undefined : ["k"],
        path: categoriesHref(),
        absolutePath: categoriesHref()
    });

    return (
        <>
            {/*
                Told which is current rather than left to the router: the media
                href names whichever view was last used, so on any other view the
                url and the link would disagree and neither would light up.

                The choice is remembered on the way through, so the next subject
                opens on the listing this one was left on - the view links do the
                same for grid against detail.
            */}
            <ToolbarLink
                href={mediaHref()}
                route={mediaRoute()}
                active={!props.showingCategories}
                clickHandler={() => setShowCategories(false)}
            />

            <ToolbarLink
                href={categoriesHref()}
                route={categoriesRoute()}
                active={props.showingCategories}
                clickHandler={() => setShowCategories(true)}
            />
        </>
    );
};

export default ToolbarListing;
