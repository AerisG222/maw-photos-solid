import { Component } from "solid-js";

import { useVisualEffectsContext } from "../contexts/VisualEffectsContext";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const RotateClockwiseButton: Component = () => {
    const [, { rotateClockwise }] = useVisualEffectsContext();

    const onRotateClockwise = () => {
        rotateClockwise();
    };

    return (
        <ToolbarButton
            icon="icon-[ic--round-rotate-right]"
            name="Rotate Right"
            tooltip="Rotate Clockwise"
            shortcutKeys={["d"]}
            clickHandler={onRotateClockwise}
        />
    );
};

export default RotateClockwiseButton;
