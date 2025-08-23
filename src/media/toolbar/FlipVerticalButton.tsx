import { Component } from "solid-js";

import { useVisualEffectsContext } from "../contexts/VisualEffectsContext";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const FlipVerticalButton: Component = () => {
    const [, { flipVertical }] = useVisualEffectsContext();

    const onFlipVertical = () => {
        flipVertical();
    };

    return (
        <ToolbarButton
            rotate90={true}
            icon="icon-[ic--round-flip]"
            name="Flip up"
            tooltip="Flip Vertical"
            clickHandler={onFlipVertical}
        />
    );
};

export default FlipVerticalButton;
