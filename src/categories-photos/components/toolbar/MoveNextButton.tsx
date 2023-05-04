import { Component } from 'solid-js';

import { usePhotoListContext } from '../../../contexts/PhotoListContext';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const MoveNextButton: Component = () => {
    const [state, {activePhotoIsLast}] = usePhotoListContext();

    const onMoveNext = () => {
        console.log("next");
    };

    return (
        <ToolbarButton
            disabled={activePhotoIsLast()}
            icon="i-ic-round-chevron-right"
            name="Move Next"
            clickHandler={onMoveNext}
        />
    );
}

export default MoveNextButton;
