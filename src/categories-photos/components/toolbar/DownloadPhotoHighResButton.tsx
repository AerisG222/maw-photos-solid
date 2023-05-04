import { Component } from 'solid-js';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const DownloadPhotoHighResButton: Component = () => {
    const onDownloadHigh = () => {
        console.log("download high");
    }

    return (
        <ToolbarButton
            icon="i-ic-round-image"
            name="High Res Download"
            clickHandler={onDownloadHigh}
        />
    );
}

export default DownloadPhotoHighResButton;
