import { Component } from 'solid-js';

import { usePhotoListContext } from '../../../contexts/PhotoListContext';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const MovePreviousButton: Component = () => {
    const [state, {activePhotoIsFirst, movePrevious}] = usePhotoListContext();

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
