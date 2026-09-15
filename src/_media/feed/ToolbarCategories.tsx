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
        <ToolbarLayout
            /*
               In the slot, not the children - which is how the media views
               already pass it, through the media toolbar's `leading`. As a
               child it folded into the overflow sheet below `md`, so the same
               switch sat in the bar while you were looking at media and behind
               the ellipsis while you were looking at categories. It is how you
               get between the two; it does not belong behind a tap.
            */
            nav={
                <ToolbarListing
                    basePath={props.basePath}
                    showingCategories={true}
                    favoritesOnly={props.favoritesOnly}
                />
            }
        >
            {/* separating the children from the nav slot, as every other
                toolbar does - the divider that used to follow the listing
                switch went into the slot with it */}
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

            <ListingToolbar labels />
        </ToolbarLayout>
    );
};

export default ToolbarCategories;
