import { Component } from 'solid-js';
import ToolbarButton from '../components/toolbar/ToolbarButton';
import ToolbarDivider from '../components/toolbar/ToolbarDivider';

const GridToolbar: Component = () => {
    const onToggleSlideshow = () => {
        console.log("slideshow");
    }

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
                icon="i-ic-round-play-arrow"
                name="Start / Stop Slideshow"
                clickHandler={onToggleSlideshow}
            />

            <ToolbarDivider />

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
