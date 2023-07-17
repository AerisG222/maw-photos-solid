import { Component, Show } from 'solid-js';
import { useParams } from '@solidjs/router';

import { usePhotoDetailViewSettingsContext } from '../contexts/settings/PhotoDetailViewSettingsContext';
import { getNextThumbnailSize } from '../_models/ThumbnailSize';
import { CategoryTypePhotos } from '../_models/CategoryType';

import ToolbarButton from '../components/toolbar/ToolbarButton';
import Divider from '../components/layout/Divider';
import ToggleSlideshowButton from './toolbar/ToggleSlideshowButton';
import MovePreviousButton from './toolbar/MovePreviousButton';
import MoveNextButton from './toolbar/MoveNextButton';
import RotateCounterClockwiseButton from './toolbar/RotateCounterClockwiseButton';
import RotateClockwiseButton from './toolbar/RotateClockwiseButton';
import FlipHorizontalButton from './toolbar/FlipHorizontalButton';
import FlipVerticalButton from './toolbar/FlipVerticalButton';
import DownloadCategoryButton from './toolbar/DownloadCategoryButton';
import DownloadPhotoLowResButton from './toolbar/DownloadPhotoLowResButton';
import DownloadPhotoMediumResButton from './toolbar/DownloadPhotoMediumResButton';
import DownloadPhotoHighResButton from './toolbar/DownloadPhotoHighResButton';
import DownloadPhotoHighUntouchedButton from './toolbar/DownloadPhotoHighUntouchedButton';

const DetailToolbar: Component = () => {
    const [settings, { setShowBreadcrumbs, setShowPhotoList, setThumbnailSize}] = usePhotoDetailViewSettingsContext();
    const params = useParams();

    const onToggleBreadcrumbs = () => {
        setShowBreadcrumbs(!settings.showBreadcrumbs);
    };

    const onTogglePhotoList = () => {
        setShowPhotoList(!settings.showPhotoList);
    };

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id);
    };

    return (
        <>
            <ToggleSlideshowButton />
            <MovePreviousButton />
            <MoveNextButton />

            <Divider />

            <Show when={params.categoryType === CategoryTypePhotos}>
                <DownloadCategoryButton />
                <Divider />
            </Show>

            <RotateCounterClockwiseButton />
            <RotateClockwiseButton />
            <FlipHorizontalButton />
            <FlipVerticalButton />

            <Divider />

            <Show when={params.categoryType === CategoryTypePhotos}>
                <DownloadPhotoLowResButton />
                <DownloadPhotoMediumResButton />
                <DownloadPhotoHighResButton />
                <DownloadPhotoHighUntouchedButton />

                <Divider />
            </Show>

            <ToolbarButton
                icon="i-ic-round-title"
                name="Show / Hide Category Breadcrumbs (T)"
                shortcutKeys={['t']}
                clickHandler={onToggleBreadcrumbs}
            />
            <ToolbarButton
                icon="i-ic-round-remove-red-eye"
                name="Show / Hide Photo List (L)"
                shortcutKeys={['l']}
                clickHandler={onTogglePhotoList}
            />
            <ToolbarButton
                icon="i-mdi-image-size-select-large"
                name="Toggle Photo List Thumbnail Size"
                shortcutKeys={['s']}
                clickHandler={onToggleThumbnailSize}
            />
        </>
    );
};

export default DetailToolbar;
