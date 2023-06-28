import { Component } from 'solid-js';

import { usePhotoListContext } from '../../../contexts/PhotoListContext';

import ToolbarExternalLink from '../../../components/toolbar/ToolbarExternalLink';

const DownloadPhotoLowResButton: Component = () => {
    const [photoListState] = usePhotoListContext();

    return (
        <ToolbarExternalLink
            title="High Res Download (untouched)"
            url={photoListState.activePhoto?.imageSmUrl}
            iconClass='i-ic-round-image'
            textClassList={{'text-sm': true}} />
    );
}

export default DownloadPhotoLowResButton;
