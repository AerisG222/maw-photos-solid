import { Component } from 'solid-js';

import { usePhotoEffectsContext } from '../../../contexts/PhotoEffectsContext';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const RotateCounterClockwiseButton: Component = () => {
    const [photoEffectsState, { rotateCounterClockwise }] = usePhotoEffectsContext();

    const onRotateCounterClockwise = () => {
        rotateCounterClockwise();
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
