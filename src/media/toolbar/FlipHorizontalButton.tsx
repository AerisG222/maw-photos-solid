import { Component } from "solid-js";

import { useVisualEffectsContext } from "../contexts/VisualEffectsContext";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const FlipHorizontalButton: Component = () => {
    const [, { flipHorizontal }] = useVisualEffectsContext();

    const onFlipHorizontal = () => {
        flipHorizontal();
    };

    return (
        <ToolbarButton
            icon="icon-[ic--round-flip]"
            name="Flip Horizontal"
            clickHandler={onFlipHorizontal}
        />
    );
};

export default FlipHorizontalButton;
