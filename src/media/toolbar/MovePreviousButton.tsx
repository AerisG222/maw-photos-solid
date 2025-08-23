import { Component } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const MovePreviousButton: Component = () => {
    const [, { activeItemIsFirst, movePrevious }] = useMediaListContext();

    return (
        <ToolbarButton
            disabled={activeItemIsFirst()}
            icon="icon-[ic--round-chevron-left]"
            name="Prev"
            tooltip="Move Previous"
            shortcutKeys={["arrowleft"]}
            clickHandler={movePrevious}
        />
    );
};

export default MovePreviousButton;
