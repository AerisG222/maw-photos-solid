import { Component } from "solid-js";

import ToolbarExternalLink from "../../_components/toolbar/ToolbarExternalLink";
import { Media } from "../../_models/Media";

interface Props {
    media?: Media;
}

const DownloadPhotoLowResButton: Component<Props> = props => {
    return (
        <ToolbarExternalLink
            name="Low Res"
            tooltip="Low Res Download"
            url={
                props.media ? (props.media.files.find(f => f.scale === "full-hd")?.path ?? "") : ""
            }
            iconClass="icon-[ic--round-image]"
            textClassList={{ "text-sm": true }}
        />
    );
};

export default DownloadPhotoLowResButton;
