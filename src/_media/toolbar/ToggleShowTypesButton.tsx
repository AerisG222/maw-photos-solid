import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    isActive: boolean;
    setShowTypesBadge: () => void;
}

const ToggleShowFavoritesBadgeButton: Component<Props> = props => {
    return (
        <ToolbarButton
            icon="icon-[mdi--label]"
            name="Media Types"
            tooltip="Toggle Media Types Badge"
            shortcutKeys={["e"]}
            clickHandler={props.setShowTypesBadge}
            active={props.isActive}
        />
    );
};

export default ToggleShowFavoritesBadgeButton;
