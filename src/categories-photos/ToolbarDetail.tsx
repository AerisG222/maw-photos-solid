import { Component } from 'solid-js';
import ToolbarButton from '../components/toolbar/ToolbarButton';
import Divider from '../components/layout/Divider';
import { usePhotoDetailViewSettingsContext } from '../contexts/PhotoDetailViewSettingsContext';
import { getNextThumbnailSize } from '../models/ThumbnailSize';

const DetailToolbar: Component = () => {
    const [settings, { setShowBreadcrumbs, setShowPhotoList, setThumbnailSize}] = usePhotoDetailViewSettingsContext();

    const onToggleSlideshow = () => {
        console.log("slideshow");
    };

    const onMovePrevious = () => {
        console.log("previous");
    };

    const onMoveNext = () => {
        console.log("next");
    };

    const onDownloadCategory = () => {
        console.log("download category");
    };

    const onRotateLeft = () => {
        console.log("rotate left");
    };

    const onRotateRight = () => {
        console.log("rotate right");
    };

    const onFlipHorizontal = () => {
        console.log("flip horizontal");
    };

    const onFlipVertical = () => {
        console.log("flip vertical");
    };

    const onDownloadSmall = () => {
        console.log("download small");
    }

    const onDownloadMedium = () => {
        console.log("download medium");
    }

    const onDownloadHigh = () => {
        console.log("download high");
    }

    const onDownloadHighUntouched = () => {
        console.log("download high untouched");
    }

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
            <ToolbarButton
                icon="i-ic-round-play-arrow"
                name="Start / Stop Slideshow"
                clickHandler={onToggleSlideshow}
            />

            <ToolbarButton
                icon="i-ic-round-navigate-before"
                name="Previous Photo"
                clickHandler={onMovePrevious}
            />

            <ToolbarButton
                icon="i-ic-round-navigate-next"
                name="Next Photo"
                clickHandler={onMoveNext}
            />

            <Divider />

            <ToolbarButton
                icon="i-ic-outline-file-download"
                name="Download All Photos in Category"
                clickHandler={onDownloadCategory}
            />

            <Divider />

            <ToolbarButton
                icon="i-ic-round-rotate-left"
                name="Rotate Left"
                clickHandler={onRotateLeft}
            />
            <ToolbarButton
                icon="i-ic-round-rotate-right"
                name="Rotate Right"
                clickHandler={onRotateRight}
            />
            <ToolbarButton
                icon="i-ic-round-flip"
                name="Flip Horizontal"
                clickHandler={onFlipHorizontal}
            />
            <ToolbarButton
                rotate90={true}
                icon="i-ic-round-flip"
                name="Flip Vertical"
                clickHandler={onFlipVertical}
            />

            <Divider />

            <ToolbarButton
                icon="i-ic-round-image"
                name="Low Res Download"
                clickHandler={onDownloadSmall}
            />
            <ToolbarButton
                icon="i-ic-round-image"
                name="Medium Res Download"
                clickHandler={onDownloadMedium}
            />
            <ToolbarButton
                icon="i-ic-round-image"
                name="High Res Download"
                clickHandler={onDownloadHigh}
            />
            <ToolbarButton
                icon="i-ic-round-image"
                name="High Res Download (untouched)"
                clickHandler={onDownloadHighUntouched}
            />

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
