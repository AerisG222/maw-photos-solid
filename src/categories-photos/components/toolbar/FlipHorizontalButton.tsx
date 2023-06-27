import { Component } from 'solid-js';

import { usePhotoEffectsContext } from '../../../contexts/PhotoEffectsContext';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const FlipHorizontalButton: Component = () => {
    const [photoEffectsState, { flipHorizontal }] = usePhotoEffectsContext();

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
}

export default FlipHorizontalButton;
