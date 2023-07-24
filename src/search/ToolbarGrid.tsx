import { Component } from 'solid-js';

import { useSearchGridViewSettingsContext } from '../contexts/settings/SearchGridViewSettingsContext';
import { getNextThumbnailSize } from '../_models/ThumbnailSize';
import { getNextMarginSize } from '../_models/Margin';

import ToolbarButton from '../components/toolbar/ToolbarButton';

const GridToolbar: Component = () => {
    const [settingsContext, { setShowTitles, setShowYears, setThumbnailSize, setMargin }] = useSearchGridViewSettingsContext();

    const onToggleYears = () => {
        setShowYears(!settingsContext.showYears);
    };

    const onToggleTitles = () => {
        setShowTitles(!settingsContext.showTitles);
    };

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settingsContext.thumbnailSize).id);
    };

    const onToggleMargins = () => {
        setMargin(getNextMarginSize(settingsContext.margin).id);
    };

    return (
        <>
            <ToolbarButton
                icon="i-ic-round-today"
                name="Show / Hide Years"
                clickHandler={onToggleYears}
            />
            <ToolbarButton
                icon="i-ic-round-title"
                name="Show / Hide Category Titles"
                clickHandler={onToggleTitles}
            />
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

export default GridToolbar;
