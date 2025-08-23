import { Component } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const MoveNextButton: Component = () => {
    const [state, { activeItemIsLast, moveNext }] = useMediaListContext();

    return (
        <ToolbarButton
            disabled={activeItemIsLast()}
            icon="icon-[ic--round-chevron-right]"
            name="Next"
            tooltip="Move Next"
            shortcutKeys={["arrowright"]}
            clickHandler={moveNext}
        />
    );
};

export default MoveNextButton;
