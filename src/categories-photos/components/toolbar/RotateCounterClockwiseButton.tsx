import { Component } from 'solid-js';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const RotateCounterClockwiseButton: Component = () => {
    const onRotateCounterClockwise = () => {
        console.log("rotate ccw");
    };

    return (
        <ToolbarButton
            icon="i-ic-round-rotate-left"
            name="Rotate Counter-Clockwise (A)"
            shortcutKeys={['a']}
            clickHandler={onRotateCounterClockwise}
        />
    );
}

export default RotateCounterClockwiseButton;
