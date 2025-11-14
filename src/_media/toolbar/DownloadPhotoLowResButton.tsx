import { Component, createMemo } from "solid-js";

import ToolbarDownloadLink, { getFilenameFromUrl } from "../../_components/toolbar/ToolbarDownloadLink";
import { Media } from "../../_models/Media";

interface Props {
    media?: Media;
}

const DownloadPhotoLowResButton: Component<Props> = props => {
    const fullResUrl = createMemo(() =>
        props.media
            ? (props.media.files.find(f => f.scale === "full-hd" && f.type !== "video-poster")?.path ?? "")
            : ""
    );

    return (
        <ToolbarDownloadLink
            name="Low Res"
            tooltip="Low Res Download"
            url={fullResUrl()}
            iconClass="icon-[ic--round-image]"
            textClassList={{ "text-sm": true }}
            downloadFileName={getFilenameFromUrl(fullResUrl(), "low")}
        />
    );
};

export default DownloadPhotoLowResButton;
