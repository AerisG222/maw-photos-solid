import { Component } from 'solid-js';

import ToolbarButton from '../components/toolbar/ToolbarButton';

const GridToolbar: Component = () => {
    const onToggleYears = () => {
        console.log("titles");
    };

    const onToggleTitles = () => {
        console.log("titles");
    };

    const onToggleThumbnailSize = () => {
        console.log("thumbnail");
    };

    const onToggleMargins = () => {
        console.log("margins");
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
