import { Component } from 'solid-js';

import { usePhotoEffectsContext } from '../../../contexts/PhotoEffectsContext';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const FlipVerticalButton: Component = () => {
    const [photoEffectsState, { flipVertical }] = usePhotoEffectsContext();

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
