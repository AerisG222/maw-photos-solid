import { Component } from 'solid-js';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const FlipHorizontalButton: Component = () => {
    const onFlipHorizontal = () => {
        console.log("fliph");
    };

    return (
        <ToolbarButton
            icon="i-ic-round-flip"
            name="Flip Horizontal"
            clickHandler={onFlipHorizontal}
        />
    );
}

export default FlipHorizontalButton;
