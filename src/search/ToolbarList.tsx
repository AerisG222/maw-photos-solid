import { Component } from 'solid-js';

import { useSearchListViewSettingsContext } from '../contexts/settings/SearchListViewSettingsContext';
import { getNextThumbnailSize } from '../_models/ThumbnailSize';
import { getNextMarginSize } from '../_models/Margin';

import ToolbarButton from '../components/toolbar/ToolbarButton';

const ListToolbar: Component = () => {
    const [settingsContext, { setMargin, setThumbnailSize }] = useSearchListViewSettingsContext();

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settingsContext.thumbnailSize).id);
    };

    const onToggleMargins = () => {
        setMargin(getNextMarginSize(settingsContext.margin).id);
    };

    return (
        <>
            <ToolbarButton
                icon="i-ic-round-photo-size-select-large"
                name="Toggle Grid Thumbnail Size"
                clickHandler={onToggleThumbnailSize}
            />
            <ToolbarButton
                icon="i-ic-round-format-indent-increase"
                name="Toggle Category Margins"
                clickHandler={onToggleMargins}
            />
        </>
    );
};

export default ListToolbar;
