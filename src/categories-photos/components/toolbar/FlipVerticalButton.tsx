import { Component } from 'solid-js';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const FlipVerticalButton: Component = () => {
    const onFlipVertical = () => {
        console.log("flipv");
    };

    return (
        <ToolbarButton
            rotate90={true}
            icon="i-ic-round-flip"
            name="Flip Vertical"
            clickHandler={onFlipVertical}
        />
    );
}

export default FlipVerticalButton;
