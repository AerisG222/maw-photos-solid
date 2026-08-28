import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    favoritesOnly: boolean;
    isShuffled: boolean;
    setFavoritesOnly: (favoritesOnly: boolean) => void;
    setShuffled: (isShuffled: boolean) => void;
}

/*
   The controls that shape the media listing of a face feed. Both write to the
   query string, so they survive a move into detail or fullscreen and a reload.

   Their keys avoid f, h and e, which the view links and the badge toggles
   already own on these screens.
*/
const ToolbarFilters: Component<Props> = props => {
    return (
        <>
            <ToolbarButton
                icon="icon-[ic--round-shuffle]"
                name="Shuffle"
                tooltip={props.isShuffled ? "Show Newest First" : "Shuffle Media"}
                shortcutKeys={["j"]}
                clickHandler={() => props.setShuffled(!props.isShuffled)}
                active={props.isShuffled}
            />
            <ToolbarButton
                // the boxed heart is the filter, in both listings; the plain one
                // beside it toggles the badge drawn on each card
                icon="icon-[mdi--heart-box]"
                name="Favorites"
                tooltip="Show Favorites Only"
                shortcutKeys={["u"]}
                clickHandler={() => props.setFavoritesOnly(!props.favoritesOnly)}
                active={props.favoritesOnly}
            />
        </>
    );
};

export default ToolbarFilters;
