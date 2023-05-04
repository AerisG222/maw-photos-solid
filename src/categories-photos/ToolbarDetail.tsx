import { Component } from 'solid-js';

import { usePhotoDetailViewSettingsContext } from '../contexts/PhotoDetailViewSettingsContext';
import { getNextThumbnailSize } from '../models/ThumbnailSize';

import ToolbarButton from '../components/toolbar/ToolbarButton';
import Divider from '../components/layout/Divider';
import ToggleSlideshowButton from './components/toolbar/ToggleSlideshowButton';
import MovePreviousButton from './components/toolbar/MovePreviousButton';
import MoveNextButton from './components/toolbar/MoveNextButton';
import RotateCounterClockwiseButton from './components/toolbar/RotateCounterClockwiseButton';
import RotateClockwiseButton from './components/toolbar/RotateClockwiseButton';
import FlipHorizontalButton from './components/toolbar/FlipHorizontalButton';
import FlipVerticalButton from './components/toolbar/FlipVerticalButton';
import DownloadCategoryButton from './components/toolbar/DownloadCategoryButton';
import DownloadPhotoLowResButton from './components/toolbar/DownloadPhotoLowResButton';
import DownloadPhotoMediumResButton from './components/toolbar/DownloadPhotoMediumResButton';
import DownloadPhotoHighResButton from './components/toolbar/DownloadPhotoHighResButton';
import DownloadPhotoHighUntouchedButton from './components/toolbar/DownloadPhotoHighUntouchedButton';

const DetailToolbar: Component = () => {
    const [settings, { setShowBreadcrumbs, setShowPhotoList, setThumbnailSize}] = usePhotoDetailViewSettingsContext();

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

            <DownloadCategoryButton />

            <Divider />

            <RotateCounterClockwiseButton />
            <RotateClockwiseButton />
            <FlipHorizontalButton />
            <FlipVerticalButton />

            <Divider />

            <DownloadPhotoLowResButton />
            <DownloadPhotoMediumResButton />
            <DownloadPhotoHighResButton />
            <DownloadPhotoHighUntouchedButton />

            <Divider />

            <ToolbarButton
                icon="i-ic-round-title"
                name="Show / Hide Category Breadcrumbs"
                clickHandler={onToggleBreadcrumbs}
            />
            <ToolbarButton
                icon="i-ic-round-remove-red-eye"
                name="Show / Hide Photo List"
                clickHandler={onTogglePhotoList}
            />
            <ToolbarButton
                icon="i-mdi-image-size-select-large"
                name="Toggle Margins"
                clickHandler={onToggleThumbnailSize}
            />
        </>
    );
};

export default DetailToolbar;
