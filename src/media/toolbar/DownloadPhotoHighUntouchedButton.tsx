import { Component } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";

import ToolbarExternalLink from "../../components/toolbar/ToolbarExternalLink";

const DownloadPhotoHighUntouchedButton: Component = () => {
    const [photoListState] = useMediaListContext();

    return (
        <ToolbarExternalLink
            title="High Res Download (untouched)"
            url={photoListState.activeItem?.imagePrtUrl}
            iconClass="i-ic-round-image" />
    );
};

export default DownloadPhotoHighUntouchedButton;
