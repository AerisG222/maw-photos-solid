import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    isActive: boolean;
    setShowBadges: () => void;
}

/*
   The corner markings on a tile: the favourite heart, and the icons saying what
   kind of media a category holds.

   One control, because there is one preference behind it. There used to be two
   buttons - Favorites on `h` and Media Types on `e` - reading and writing two
   flags that were kept in step with each other by hand across six stores. Once
   those became a single setting the two buttons did the same thing, which is
   how it was noticed.
*/
const ToggleShowBadgesButton: Component<Props> = props => {
    return (
        <ToolbarButton
            icon="icon-[ic--round-label]"
            name="Badges"
            tooltip="Toggle Badges"
            shortcutKeys={["h"]}
            clickHandler={props.setShowBadges}
            active={props.isActive}
        />
    );
};

export default ToggleShowBadgesButton;
