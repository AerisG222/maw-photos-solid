import { Component } from 'solid-js';

import { usePhotoEffectsContext } from '../../../contexts/PhotoEffectsContext';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const RotateClockwiseButton: Component = () => {
    const [photoEffectsState, { rotateClockwise }] = usePhotoEffectsContext();

    const onRotateClockwise = () => {
        rotateClockwise();
    };

    return (
        <ToolbarButton
            icon="i-ic-round-rotate-right"
            name="Rotate Right (D)"
            shortcutKeys={['d']}
            clickHandler={onRotateClockwise}
        />
    );
};

export default RotateClockwiseButton;
