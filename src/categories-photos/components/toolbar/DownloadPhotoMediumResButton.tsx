import { Component } from 'solid-js';

import { usePhotoListContext } from '../../../contexts/PhotoListContext';

import ToolbarExternalLink from '../../../components/toolbar/ToolbarExternalLink';

const DownloadPhotoMediumResButton: Component = () => {
    const [photoListState] = usePhotoListContext();

    return (
        <ToolbarExternalLink
            title="High Res Download (untouched)"
            url={photoListState.activePhoto?.imageMdUrl}
            iconClass='i-ic-round-image'
            textClassList={{'text-lg': true}} />
    );
}

export default DownloadPhotoMediumResButton;
