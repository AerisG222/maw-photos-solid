import { Component } from 'solid-js';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const RotateClockwiseButton: Component = () => {
    const onRotateClockwise = () => {
        console.log("rotate cw");
    };

    return (
        <ToolbarButton
            icon="i-ic-round-rotate-right"
            name="Rotate Right"
            clickHandler={onRotateClockwise}
        />
    );
}

export default RotateClockwiseButton;
