import { Component, Show } from 'solid-js';

import ToolbarButton from '../../components/toolbar/ToolbarButton';
import { useSlideshowContext } from '../../contexts/SlideshowContext';
import { useParams } from '@solidjs/router';
import { categoryTypes } from '../../_models/CategoryTypes';

const ToggleSlideshowButton: Component = () => {
    const [state, { toggle }] = useSlideshowContext();
    const params = useParams();

    const onToggleSlideshow = () => {
        toggle();
    };

    return (
        <Show when={categoryTypes[params.categoryType].slideshowAvailable}>
            <ToolbarButton
                icon={state.isPlaying ? 'i-ic-round-stop' : 'i-ic-round-play-arrow'}
                name="Start / Stop Slideshow (P)"
                shortcutKeys={['p']}
                clickHandler={onToggleSlideshow}
            />
        </Show>
    );
};

export default ToggleSlideshowButton;
