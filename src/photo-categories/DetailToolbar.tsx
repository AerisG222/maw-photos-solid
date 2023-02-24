import { Component } from 'solid-js';
import ToolbarButton from '../components/toolbar/ToolbarButton';
import ToolbarDivider from '../components/toolbar/ToolbarDivider';

const DetailToolbar: Component = () => {
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
        console.log("titles");
    };

    const onTogglePhotoList = () => {
        console.log("toggle photo list");
    };

    const onToggleMargins = () => {
        console.log("margins");
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

            <ToolbarDivider />

            <ToolbarButton
                icon="i-ic-outline-file-download"
                name="Download All Photos in Category"
                clickHandler={onDownloadCategory}
            />

            <ToolbarDivider />

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

            <ToolbarDivider />

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

            <ToolbarDivider />

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
                icon="i-ic-round-format-indent-increase"
                name="Toggle Margins"
                clickHandler={onToggleMargins}
            />
        </>
    );
};

export default DetailToolbar;
