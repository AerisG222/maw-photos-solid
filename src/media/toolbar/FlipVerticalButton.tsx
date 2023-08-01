import { Component } from "solid-js";

import { useVisualEffectsContext } from "../contexts/VisualEffectsContext";

import ToolbarButton from "../../components/toolbar/ToolbarButton";

const FlipVerticalButton: Component = () => {
    const [, { flipVertical }] = useVisualEffectsContext();

    const onFlipVertical = () => {
        flipVertical();
    };

    return (
        <ToolbarButton
            rotate90={true}
            icon="i-ic-round-flip"
            name="Flip Vertical"
            clickHandler={onFlipVertical}
        />
    );
};

export default FlipVerticalButton;
