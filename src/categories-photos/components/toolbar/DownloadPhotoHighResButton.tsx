import { Component } from 'solid-js';

import { usePhotoListContext } from '../../../contexts/PhotoListContext';

import ToolbarExternalLink from '../../../components/toolbar/ToolbarExternalLink';

const DownloadPhotoHighResButton: Component = () => {
    const [photoListState] = usePhotoListContext();

    return (
        <ToolbarExternalLink
            title="High Res Download"
            url={photoListState.activePhoto?.imageLgUrl}
            iconClass='i-ic-round-image' />
    );
}

export default DownloadPhotoHighResButton;
