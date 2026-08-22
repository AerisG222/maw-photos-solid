import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    favoritesOnly: boolean;
    isShuffled: boolean;
    setFavoritesOnly: (favoritesOnly: boolean) => void;
    setShuffled: (isShuffled: boolean) => void;
}

/*
   The two controls that shape a person's feed. Both write to the query string,
   so they survive a move into detail or fullscreen and a reload.

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
                icon="icon-[mdi--heart]"
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
