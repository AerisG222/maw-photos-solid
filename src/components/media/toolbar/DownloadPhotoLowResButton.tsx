import { Component } from 'solid-js';

import { useMediaListContext } from '../../../contexts/MediaListContext';

import ToolbarExternalLink from '../../../components/toolbar/ToolbarExternalLink';

const DownloadPhotoLowResButton: Component = () => {
    const [photoListState] = useMediaListContext();

    return (
        <ToolbarExternalLink
            title="High Res Download (untouched)"
            url={photoListState.activeItem?.imageSmUrl}
            iconClass='i-ic-round-image'
            textClassList={{'text-sm': true}} />
    );
}

export default DownloadPhotoLowResButton;
