import { Component } from 'solid-js';

import { usePhotoListContext } from '../../../contexts/PhotoListContext';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const MoveNextButton: Component = () => {
    const [state, {activePhotoIsLast, moveNext}] = usePhotoListContext();

    return (
        <ToolbarButton
            disabled={activePhotoIsLast()}
            icon="i-ic-round-chevron-right"
            name="Move Next (&rarr;)"
            shortcutKeys={['arrowright']}
            clickHandler={moveNext}
        />
    );
}

export default MoveNextButton;
