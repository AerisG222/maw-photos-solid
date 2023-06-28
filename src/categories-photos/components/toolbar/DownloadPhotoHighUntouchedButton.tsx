import { Component } from 'solid-js';

import { usePhotoListContext } from '../../../contexts/PhotoListContext';

import ToolbarExternalLink from '../../../components/toolbar/ToolbarExternalLink';

const DownloadPhotoHighUntouchedButton: Component = () => {
    const [photoListState] = usePhotoListContext();

    return (
        <ToolbarExternalLink
            title="High Res Download (untouched)"
            url={photoListState.activePhoto?.imagePrtUrl}
            iconClass='i-ic-round-image' />
    );
}

export default DownloadPhotoHighUntouchedButton;
