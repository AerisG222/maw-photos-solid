import { Component } from 'solid-js';

import { useVisualEffectsContext } from '../../contexts/VisualEffectsContext';

import ToolbarButton from '../../components/toolbar/ToolbarButton';

const RotateClockwiseButton: Component = () => {
    const [, { rotateClockwise }] = useVisualEffectsContext();

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
