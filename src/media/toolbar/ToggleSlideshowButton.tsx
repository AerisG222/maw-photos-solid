import { Component, Show } from 'solid-js';

import { useSlideshowContext } from '../../contexts/SlideshowContext';
import { useParams } from '@solidjs/router';
import { categoryTypes } from '../../_models/CategoryTypes';
import { useMediaListContext } from '../../contexts/MediaListContext';
import { MediaListMode, MediaListModeCategory, MediaListModeRandom } from '../../_models/Media';
import { CategoryType } from '../../_models/CategoryType';

import ToolbarButton from '../../components/toolbar/ToolbarButton';

const ToggleSlideshowButton: Component = () => {
    const [state, { toggle }] = useSlideshowContext();
    const [mediaContext] = useMediaListContext();
    const params = useParams();

    const onToggleSlideshow = () => {
        toggle();
    };

    return (
        <Show when={showSlideshowButton(mediaContext.mode, params.categoryType as CategoryType)}>
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

export const showSlideshowButton = (mode: MediaListMode, categoryType?: CategoryType) => {
    switch(mode) {
        case MediaListModeCategory:
            return categoryType ? categoryTypes[categoryType].slideshowAvailable : false;
        case MediaListModeRandom:
            return true;
        default:
            return false;
    }
};
