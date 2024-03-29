import { Component } from "solid-js";

import { useVisualEffectsContext } from "../contexts/VisualEffectsContext";

import ToolbarButton from "../../components/toolbar/ToolbarButton";

const RotateCounterClockwiseButton: Component = () => {
    const [, { rotateCounterClockwise }] = useVisualEffectsContext();

    const onRotateCounterClockwise = () => {
        rotateCounterClockwise();
    };

    return (
        <ToolbarButton
            icon="i-ic-round-rotate-left"
            name="Rotate Counter-Clockwise"
            shortcutKeys={["a"]}
            clickHandler={onRotateCounterClockwise}
        />
    );
};

export default RotateCounterClockwiseButton;
