import { Component } from 'solid-js';

import { usePhotoGridViewSettings } from '../contexts/PhotoGridViewSettingsContext';
import { getNextMarginSize } from '../models/Margin';

import ToolbarButton from '../components/toolbar/ToolbarButton';
import ToolbarDivider from '../components/toolbar/ToolbarDivider';
import { getNextThumbnailSize } from '../models/ThumbnailSize';

const GridToolbar: Component = () => {
    const [settings, {setShowBreadcrumbs, setThumbnailSize, setMargin}] = usePhotoGridViewSettings();

    const onToggleSlideshow = () => {
        console.log("slideshow");
    }

    const onToggleBreadcrumbs = () => {
        setShowBreadcrumbs(!settings.showBreadcrumbs);
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
