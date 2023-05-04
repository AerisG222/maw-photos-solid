import { Component } from 'solid-js';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const DownloadPhotoHighUntouchedButton: Component = () => {
    const onDownloadHighUntouched = () => {
        console.log("download high untouched");
    }

    return (
        <ToolbarButton
            icon="i-ic-round-image"
            name="High Res Download (untouched)"
            clickHandler={onDownloadHighUntouched}
        />
    );
}

export default DownloadPhotoHighUntouchedButton;
