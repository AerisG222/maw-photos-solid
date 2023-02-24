import { Component } from 'solid-js';
import ToolbarButton from '../components/toolbar/ToolbarButton';
import ToolbarDivider from '../components/toolbar/ToolbarDivider';

const FullscreenToolbar: Component = () => {
    const onToggleSlideshow = () => {
        console.log("slideshow");
    };

    const onMovePrevious = () => {
        console.log("previous");
    };

    const onMoveNext = () => {
        console.log("next");
    };

    const onRotateLeft = () => {
        console.log("rotate left");
    };

    const onRotateRight = () => {
        console.log("rotate right");
    };

    const onFlipHorizontal = () => {
        console.log("flip horizontal");
    };

    const onFlipVertical = () => {
        console.log("flip vertical");
    };

    return (
        <>
            <ToolbarButton
                icon="i-ic-round-play-arrow"
                name="Start / Stop Slideshow"
                clickHandler={onToggleSlideshow}
            />

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

            <ToolbarDivider />

            <ToolbarButton
                icon="i-ic-round-rotate-left"
                name="Rotate Left"
                clickHandler={onRotateLeft}
            />
            <ToolbarButton
                icon="i-ic-round-rotate-right"
                name="Rotate Right"
                clickHandler={onRotateRight}
            />
            <ToolbarButton
                icon="i-ic-round-flip"
                name="Flip Horizontal"
                clickHandler={onFlipHorizontal}
            />
            <ToolbarButton
                rotate90={true}
                icon="i-ic-round-flip"
                name="Flip Vertical"
                clickHandler={onFlipVertical}
            />
        </>
    );
};

export default FullscreenToolbar;
