import { Component } from 'solid-js';

import { useMediaListContext } from '../../../contexts/MediaListContext';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const MovePreviousButton: Component = () => {
    const [state, {activeItemIsFirst: activePhotoIsFirst, movePrevious}] = useMediaListContext();

    return (
        <ToolbarButton
            disabled={activePhotoIsFirst()}
            icon="i-ic-round-chevron-left"
            name="Move Previous (&larr;)"
            shortcutKeys={['arrowleft']}
            clickHandler={movePrevious}
        />
    );
}

export default MovePreviousButton;
