import { Component } from 'solid-js';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';
import { useSlideshowContext } from '../../../contexts/SlideshowContext';

const ToggleSlideshowButton: Component = () => {
    const [state, { toggle }] = useSlideshowContext();

    const onToggleSlideshow = () => {
        toggle();
    };

    return (
        <ToolbarButton
            icon={state.isPlaying ? 'i-ic-round-stop' : 'i-ic-round-play-arrow'}
            name="Start / Stop Slideshow (P)"
            shortcutKeys={['p']}
            clickHandler={onToggleSlideshow}
        />
    );
}

export default ToggleSlideshowButton;
