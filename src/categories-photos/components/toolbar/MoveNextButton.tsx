import { Component } from 'solid-js';

import { useMediaListContext } from '../../../contexts/MediaListContext';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const MoveNextButton: Component = () => {
    const [state, {activeItemIsLast: activePhotoIsLast, moveNext}] = useMediaListContext();

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
