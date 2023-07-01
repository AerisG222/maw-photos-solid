import { Component } from 'solid-js';

import { useMediaListContext } from '../../../contexts/MediaListContext';

import ToolbarExternalLink from '../../../components/toolbar/ToolbarExternalLink';

const DownloadPhotoMediumResButton: Component = () => {
    const [photoListState] = useMediaListContext();

    return (
        <ToolbarExternalLink
            title="High Res Download (untouched)"
            url={photoListState.activePhoto?.imageMdUrl}
            iconClass='i-ic-round-image'
            textClassList={{'text-lg': true}} />
    );
}

export default DownloadPhotoMediumResButton;
