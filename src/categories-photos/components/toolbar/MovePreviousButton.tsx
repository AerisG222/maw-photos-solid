import { Component } from 'solid-js';

import { usePhotoListContext } from '../../../contexts/PhotoListContext';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const MovePreviousButton: Component = () => {
    const [state, {activePhotoIsFirst}] = usePhotoListContext();

    const onMovePrevious = () => {
        console.log("previous");
    };

    return (
        <ToolbarButton
            disabled={activePhotoIsFirst()}
            icon="i-ic-round-chevron-left"
            name="Move Previous"
            clickHandler={onMovePrevious}
        />
    );
}

export default MovePreviousButton;
