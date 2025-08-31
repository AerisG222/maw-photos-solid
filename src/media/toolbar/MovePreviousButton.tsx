import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

type Props = {
    isFirst: boolean;
    movePrevious: () => void;
};

const MovePreviousButton: Component<Props> = props => {
    return (
        <ToolbarButton
            disabled={props.isFirst}
            icon="icon-[ic--round-chevron-left]"
            name="Prev"
            tooltip="Move Previous"
            shortcutKeys={["arrowleft"]}
            clickHandler={props.movePrevious}
        />
    );
};

export default MovePreviousButton;
