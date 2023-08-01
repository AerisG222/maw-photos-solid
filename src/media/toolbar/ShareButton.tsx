import { Component } from 'solid-js';

import { useMediaListContext } from '../contexts/MediaListContext';
import { getMediaShareUrl } from '../../_models/Media';

import ToolbarButton from '../../components/toolbar/ToolbarButton';

const ShareButton: Component = () => {
    const [mediaContext] = useMediaListContext();

    const onShare = () => {
        try {
            navigator.share({ url: getMediaShareUrl(mediaContext.activeItem) });
        } catch {
            console.error('Error sharing media');
        }
    };

    return (
        <ToolbarButton
            icon="i-ic-baseline-share"
            name="Share"
            clickHandler={onShare}
        />
    );
};

export default ShareButton;
