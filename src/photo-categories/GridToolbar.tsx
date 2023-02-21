import { Component } from 'solid-js';
import ToolbarButton from '../components/toolbar/ToolbarButton';

const GridToolbar: Component = () => {
    const onToggleBreadcrumbs = () => {
        console.log("titles");
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
                name="Show / Hide Category Breadcrumbs"
                clickHandler={onToggleBreadcrumbs}
            />
            <ToolbarButton
                icon="i-ic-round-photo-size-select-large"
                name="Toggle Thumbnail Size"
                clickHandler={onToggleThumbnailSize}
            />
            <ToolbarButton
                icon="i-ic-round-format-indent-increase"
                name="Toggle Margins"
                clickHandler={onToggleMargins}
            />
        </>
    );
};

export default GridToolbar;
