import { Component } from 'solid-js';

import ToolbarButton from '../components/toolbar/ToolbarButton';
import { useCategoryGridViewSettingsContext } from '../contexts/settings/CategoryGridViewSettingsContext';
import { defaultGridThumbnailSize, getNextThumbnailSize } from '../models/ThumbnailSize';
import { getNextMarginSize } from '../models/Margin';

const GridToolbar: Component = () => {
    const [settings, { setShowTitles, setMargin, setThumbnailSize }] = useCategoryGridViewSettingsContext();

    const onToggleTitles = () => {
        setShowTitles(!settings.showTitles);
    };

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id);
    }

    const onToggleMargins = () => {
        setMargin(getNextMarginSize(settings.margin).id);
    }

    return (
        <>
            <ToolbarButton
                icon="i-ic-round-title"
                name="Show / Hide Category Titles (T)"
                shortcutKeys={['t']}
                clickHandler={onToggleTitles}
                disabled={settings.thumbnailSize !== defaultGridThumbnailSize}
            />
            <ToolbarButton
                icon="i-ic-round-photo-size-select-large"
                name="Toggle Grid Thumbnail Size (S)"
                shortcutKeys={['s']}
                clickHandler={onToggleThumbnailSize}
            />
            <ToolbarButton
                icon="i-ic-round-format-indent-increase"
                name="Toggle Category Margins (M)"
                shortcutKeys={['m']}
                clickHandler={onToggleMargins}
            />
        </>
    );
};

export default GridToolbar;
