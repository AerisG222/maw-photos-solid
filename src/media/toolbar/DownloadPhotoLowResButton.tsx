import { Component } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";

import ToolbarExternalLink from "../../_components/toolbar/ToolbarExternalLink";

const DownloadPhotoLowResButton: Component = () => {
    const [photoListState] = useMediaListContext();

    return (
        <ToolbarExternalLink
            name="Low Res"
            tooltip="Low Res Download"
            url={photoListState.activeItem?.imageSmUrl}
            iconClass="icon-[ic--round-image]"
            textClassList={{ "text-sm": true }}
        />
    );
};

export default DownloadPhotoLowResButton;
