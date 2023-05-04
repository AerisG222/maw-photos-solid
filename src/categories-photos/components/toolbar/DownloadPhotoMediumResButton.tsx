import { Component } from 'solid-js';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const DownloadPhotoMediumResButton: Component = () => {
    const onDownloadMedium = () => {
        console.log("download medium");
    }

    return (
        <ToolbarButton
            icon="i-ic-round-image text-lg"
            name="Medium Res Download"
            clickHandler={onDownloadMedium}
        />
    );
}

export default DownloadPhotoMediumResButton;
