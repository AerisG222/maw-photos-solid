import { Component, Show } from 'solid-js';

import { usePhotoGridViewSettingsContext } from '../contexts/settings/PhotoGridViewSettingsContext';
import { getNextMarginSize } from '../_models/Margin';
import { getNextThumbnailSize } from '../_models/ThumbnailSize';
import { useMediaListContext } from '../contexts/MediaListContext';

import ToolbarButton from '../components/toolbar/ToolbarButton';
import Divider from '../components/layout/Divider';
import MovePreviousButton from './toolbar/MovePreviousButton';
import MoveNextButton from './toolbar/MoveNextButton';
import ToggleSlideshowButton from './toolbar/ToggleSlideshowButton';
import RotateCounterClockwiseButton from './toolbar/RotateCounterClockwiseButton';
import RotateClockwiseButton from './toolbar/RotateClockwiseButton';
import FlipHorizontalButton from './toolbar/FlipHorizontalButton';
import FlipVerticalButton from './toolbar/FlipVerticalButton';

const GridToolbar: Component = () => {
    const [settings, {setShowBreadcrumbs, setThumbnailSize, setMargin}] = usePhotoGridViewSettingsContext();
    const [state] = useMediaListContext();

    const onToggleBreadcrumbs = () => {
        setShowBreadcrumbs(!settings.showBreadcrumbs);
    };

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id);
    };

    const onToggleMargins = () => {
        setMargin(getNextMarginSize(settings.margin).id);
    };

    return (
        <>
            <ToggleSlideshowButton />

            <Show when={state.activeItem}>
                <MovePreviousButton />
                <MoveNextButton />
            </Show>

            <Divider />

            <Show when={!state.activeItem}>
                <ToolbarButton
                    icon="i-ic-round-title"
                    name="Show / Hide Category Breadcrumbs (T)"
                    shortcutKeys={['t']}
                    clickHandler={onToggleBreadcrumbs}
                />
                <ToolbarButton
                    icon="i-ic-round-photo-size-select-large"
                    name="Toggle Thumbnail Size (S)"
                    shortcutKeys={['s']}
                    clickHandler={onToggleThumbnailSize}
                />
                <ToolbarButton
                    icon="i-ic-round-format-indent-increase"
                    name="Toggle Margins (M)"
                    shortcutKeys={['m']}
                    clickHandler={onToggleMargins}
                />
            </Show>

            <Show when={state.activeItem}>
                <RotateCounterClockwiseButton />
                <RotateClockwiseButton />
                <FlipHorizontalButton />
                <FlipVerticalButton />
            </Show>
        </>
    );
};

export default GridToolbar;
