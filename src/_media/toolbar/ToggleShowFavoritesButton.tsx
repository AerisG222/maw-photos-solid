import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    setShowFavoritesBadge: () => void;
}

const ToggleShowFavoritesBadgeButton: Component<Props> = props => {
    return (
        <ToolbarButton
            icon="icon-[mdi--heart]"
            name="Favorites"
            tooltip="Toggle Favorites Badge"
            shortcutKeys={["h"]}
            clickHandler={props.setShowFavoritesBadge}
        />
    );
};

export default ToggleShowFavoritesBadgeButton;
