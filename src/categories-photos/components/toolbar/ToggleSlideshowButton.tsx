import { Component } from 'solid-js';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const ToggleSlideshowButton: Component = () => {
    const onToggleSlideshow = () => {
        console.log("slideshow");
    };

    return (
        <ToolbarButton
            icon="i-ic-round-play-arrow"
            name="Start / Stop Slideshow"
            clickHandler={onToggleSlideshow}
        />
    );
}

export default ToggleSlideshowButton;
