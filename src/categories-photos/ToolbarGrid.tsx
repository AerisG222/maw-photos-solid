import { Component, Show } from 'solid-js';

import { usePhotoGridViewSettingsContext } from '../contexts/PhotoGridViewSettingsContext';
import { getNextMarginSize } from '../models/Margin';
import { getNextThumbnailSize } from '../models/ThumbnailSize';
import { usePhotoListContext } from '../contexts/PhotoListContext';

import ToolbarButton from '../components/toolbar/ToolbarButton';
import Divider from '../components/layout/Divider';

const GridToolbar: Component = () => {
    const [settings, {setShowBreadcrumbs, setThumbnailSize, setMargin}] = usePhotoGridViewSettingsContext();
    const [state, {activePhotoIsFirst, activePhotoIsLast}] = usePhotoListContext();

    const onToggleSlideshow = () => {
        console.log("slideshow");
    }

    const onMoveNext = () => {
        console.log('move next');
    }

    const onMovePrevious = () => {
        console.log('move prev');
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

    const onRotateCounterClockwise = () => {
        console.log('rotate ccw');
    }

    const onRotateClockwise = () => {
        console.log('rotate cw');
    }

    const onFlipHorizontal = () => {
        console.log('fliph');
    }

    const onFlipVertical = () => {
        console.log('flipw');
    }

    return (
        <>
            <ToolbarButton
                icon="i-ic-round-play-arrow"
                name="Start / Stop Slideshow"
                clickHandler={onToggleSlideshow}
            />

            <Show when={state.activePhoto}>
                <ToolbarButton
                    disabled={activePhotoIsFirst()}
                    icon="i-ic-round-chevron-left"
                    name="Move Previous"
                    clickHandler={onMovePrevious}
                />
                <ToolbarButton
                    disabled={activePhotoIsLast()}
                    icon="i-ic-round-chevron-right"
                    name="Move Next"
                    clickHandler={onMoveNext}
                />
            </Show>

            <Divider />

            <Show when={!state.activePhoto}>
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
            </Show>

            <Show when={state.activePhoto}>
                <ToolbarButton
                    icon="i-ic-round-rotate-left"
                    name="Rotate Counter-Clockwise"
                    clickHandler={onRotateCounterClockwise}
                />
                <ToolbarButton
                    icon="i-ic-round-rotate-right"
                    name="Rotate Clockwise"
                    clickHandler={onRotateClockwise}
                />
                <ToolbarButton
                    icon="i-ic-round-flip"
                    name="Flip Horizontal"
                    clickHandler={onFlipHorizontal}
                />
                <ToolbarButton
                    icon="i-ic-round-flip rotate-90"
                    name="Flip Vertical"
                    clickHandler={onFlipVertical}
                />
            </Show>
        </>
    );
};

export default GridToolbar;
