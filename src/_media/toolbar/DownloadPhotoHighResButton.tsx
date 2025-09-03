import { Component } from "solid-js";

import ToolbarExternalLink from "../../_components/toolbar/ToolbarExternalLink";

import { Media } from "../../_models/Media";

type Props = {
    media?: Media;
};

const DownloadPhotoHighResButton: Component<Props> = props => {
    return (
        <ToolbarExternalLink
            name="High Res"
            tooltip="High Res Download"
            url={props.media ? (props.media.files.find(f => f.scale === "full")?.path ?? "") : ""}
            iconClass="icon-[ic--round-image]"
        />
    );
};

export default DownloadPhotoHighResButton;
