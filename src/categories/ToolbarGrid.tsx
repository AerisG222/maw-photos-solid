import { Component } from 'solid-js';

import ToolbarButton from '../components/toolbar/ToolbarButton';
import { useCategoryGridViewSettings } from '../contexts/CategoryGridViewSettingsContext';

const GridToolbar: Component = () => {
    const [settings, { setShowTitles }] = useCategoryGridViewSettings();

    const onToggleTitles = () => {
        setShowTitles(!settings.showTitles);
    };

    const onToggleThumbnailSize = () => {
        console.log("thumbnail");
    }

    const onToggleMargins = () => {
        console.log("margins");
    }

    return (
        <>
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
