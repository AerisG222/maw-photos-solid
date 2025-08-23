import { Component } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";

import ToolbarExternalLink from "../../_components/toolbar/ToolbarExternalLink";

const DownloadPhotoHighResButton: Component = () => {
    const [photoListState] = useMediaListContext();

    return (
        <ToolbarExternalLink
            name="High Res"
            tooltip="High Res Download"
            url={photoListState.activeItem?.imageLgUrl}
            iconClass="icon-[ic--round-image]"
        />
    );
};

export default DownloadPhotoHighResButton;
