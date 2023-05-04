import { Component } from 'solid-js';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const DownloadCategoryButton: Component = () => {
    const onDownloadCategory = () => {
        console.log("download category");
    };

    return (
        <ToolbarButton
            icon="i-ic-outline-file-download"
            name="Download All Photos in Category"
            clickHandler={onDownloadCategory}
        />
    );
}

export default DownloadCategoryButton;
