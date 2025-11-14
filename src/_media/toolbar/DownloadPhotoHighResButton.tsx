import { Component, createMemo } from "solid-js";

import ToolbarDownloadLink, { getFilenameFromUrl } from "../../_components/toolbar/ToolbarDownloadLink";

import { Media } from "../../_models/Media";

interface Props {
    media?: Media;
}

const DownloadPhotoHighResButton: Component<Props> = props => {
    const fullResUrl = createMemo(() =>
        props.media
            ? (props.media.files.find(f => f.scale === "full" && f.type !== "video-poster")?.path ?? "")
            : ""
    );

    return (
        <ToolbarDownloadLink
            name="High Res"
            tooltip="High Res Download"
            url={fullResUrl()}
            iconClass="icon-[ic--round-image]"
            downloadFileName={getFilenameFromUrl(fullResUrl(), "high")}
        />
    );
};

export default DownloadPhotoHighResButton;
