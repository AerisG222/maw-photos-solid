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
   query string, so they survive a reload and a move between views.

   Their keys avoid the ones the other controls on these screens already own -
   which is now checked rather than remembered, by the collision guard in
   `ShortcutContext` and by `ShortcutReference.test.ts`.
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
                icon="icon-[ic--round-filter-alt]"
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
