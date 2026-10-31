import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    isShuffled: boolean;
    setShuffled: (isShuffled: boolean) => void;
}

/*
   How a feed's media is ordered, which writes to the query string so it survives
   a reload and a move between views. What narrows it is in the page header - see
   FeedFilterMenu.

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
        </>
    );
};

export default ToolbarFilters;
