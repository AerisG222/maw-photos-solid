import { Component } from 'solid-js';
import ToolbarButton from '../components/toolbar/ToolbarButton';

const FullscreenToolbar: Component = () => {
    const onMovePrevious = () => {
        console.log("previous");
    };

    const onMoveNext = () => {
        console.log("next");
    };

    return (
        <>
            <ToolbarButton
                icon="i-ic-round-navigate-before"
                name="Previous Photo"
                clickHandler={onMovePrevious}
            />

            <ToolbarButton
                icon="i-ic-round-navigate-next"
                name="Next Photo"
                clickHandler={onMoveNext}
            />
        </>
    );
};

export default FullscreenToolbar;
