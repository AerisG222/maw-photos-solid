import { Component } from "solid-js";

import { getMediaShareUrl } from "../../_models/utils/MediaUtils";
import { Media } from "../../_models/Media";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    activeMedia: Media;
}

const ShareButton: Component<Props> = props => {
    const onShare = () => {
        try {
            navigator.share({ url: getMediaShareUrl(props.activeMedia) });
        } catch {
            console.error("Error sharing media");
        }
    };

    return (
        <ToolbarButton
            icon="icon-[ic--baseline-share]"
            name="Share"
            tooltip="Share"
            clickHandler={onShare}
        />
    );
};

export default ShareButton;
