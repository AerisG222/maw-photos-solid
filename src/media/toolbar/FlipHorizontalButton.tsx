import { Component } from "solid-js";

import { useVisualEffectsContext } from "../contexts/VisualEffectsContext";

import ToolbarButton from "../../components/toolbar/ToolbarButton";

const FlipHorizontalButton: Component = () => {
    const [, { flipHorizontal }] = useVisualEffectsContext();

    const onFlipHorizontal = () => {
        flipHorizontal();
    };

    return (
        <ToolbarButton
            icon="i-ic-round-flip"
            name="Flip Horizontal"
            clickHandler={onFlipHorizontal}
        />
    );
};

export default FlipHorizontalButton;
