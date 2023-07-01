import { Component, Show } from 'solid-js';

import { usePhotoGridViewSettingsContext } from '../contexts/settings/PhotoGridViewSettingsContext';
import { getNextMarginSize } from '../models/Margin';
import { getNextThumbnailSize } from '../models/ThumbnailSize';
import { useMediaListContext } from '../contexts/MediaListContext';

import ToolbarButton from '../components/toolbar/ToolbarButton';
import Divider from '../components/layout/Divider';
import MovePreviousButton from './components/toolbar/MovePreviousButton';
import MoveNextButton from './components/toolbar/MoveNextButton';
import ToggleSlideshowButton from './components/toolbar/ToggleSlideshowButton';
import RotateCounterClockwiseButton from './components/toolbar/RotateCounterClockwiseButton';
import RotateClockwiseButton from './components/toolbar/RotateClockwiseButton';
import FlipHorizontalButton from './components/toolbar/FlipHorizontalButton';
import FlipVerticalButton from './components/toolbar/FlipVerticalButton';

const GridToolbar: Component = () => {
    const [settings, {setShowBreadcrumbs, setThumbnailSize, setMargin}] = usePhotoGridViewSettingsContext();
    const [state] = useMediaListContext();

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
