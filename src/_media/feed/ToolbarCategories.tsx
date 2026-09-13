import { Component } from "solid-js";

import RequestMoreButton from "../../_components/toolbar/RequestMoreButton";
import ListingToolbar from "../../_components/listing/ListingToolbar";
import ToolbarButton from "../../_components/toolbar/ToolbarButton";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import ToolbarListing from "./ToolbarListing";

interface Props {
    basePath: string;
    favoritesOnly: boolean;
    canRequestMore: boolean;
    setFavoritesOnly: (favoritesOnly: boolean) => void;
    requestMore: () => void;
}

/*
   The toolbar for the categories listing.

   Only what applies here: no grid / detail / fullscreen links, because those are
   ways of looking at one photo, and no shuffle, because the API orders
   categories and takes no seed. Switching back to the media brings both back.
*/
const ToolbarCategories: Component<Props> = props => {
    // a card only has room for its title and year at the full size, so turning
    // either back on restores it - the same rule the search results follow

    return (
        <ToolbarLayout>
            <ToolbarListing
                basePath={props.basePath}
                showingCategories={true}
                favoritesOnly={props.favoritesOnly}
            />

            <ToolbarDivider />

            <ToolbarButton
                icon="icon-[ic--round-filter-alt]"
                name="Favorites"
                tooltip="Show Favorites Only"
                shortcutKeys={["u"]}
                clickHandler={() => props.setFavoritesOnly(!props.favoritesOnly)}
                active={props.favoritesOnly}
            />

            <ToolbarDivider />

            <RequestMoreButton disabled={!props.canRequestMore} requestMore={props.requestMore} />

            <ToolbarDivider />

            <ListingToolbar labels density dim badges />
        </ToolbarLayout>
    );
};

export default ToolbarCategories;
