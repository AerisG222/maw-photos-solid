import { Component } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";

import ToolbarButton from "../../components/toolbar/ToolbarButton";

const MovePreviousButton: Component = () => {
    const [state, {activeItemIsFirst, movePrevious}] = useMediaListContext();

    return (
        <ToolbarButton
            disabled={activeItemIsFirst()}
            icon="i-ic-round-chevron-left"
            name="Move Previous"
            shortcutKeys={["arrowleft"]}
            clickHandler={movePrevious}
        />
    );
};

export default MovePreviousButton;
