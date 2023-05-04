import { Component } from 'solid-js';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const DownloadPhotoLowResButton: Component = () => {
    const onDownloadSmall = () => {
        console.log("download small");
    }

    return (
        <ToolbarButton
            icon="i-ic-round-image text-sm"
            name="Low Res Download"
            clickHandler={onDownloadSmall}
        />
    );
}

export default DownloadPhotoLowResButton;
