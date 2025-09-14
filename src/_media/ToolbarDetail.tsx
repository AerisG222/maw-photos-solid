import { Component, Show } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { getNextThumbnailSize } from "../_models/ThumbnailSize";
import { Category } from "../_models/Category";
import { Media } from "../_models/Media";

import ToolbarButton from "../_components/toolbar/ToolbarButton";
import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import ToggleSlideshowButton from "./toolbar/ToggleSlideshowButton";
import MovePreviousButton from "./toolbar/MovePreviousButton";
import MoveNextButton from "./toolbar/MoveNextButton";
import RotateCounterClockwiseButton from "./toolbar/RotateCounterClockwiseButton";
import RotateClockwiseButton from "./toolbar/RotateClockwiseButton";
import FlipHorizontalButton from "./toolbar/FlipHorizontalButton";
import FlipVerticalButton from "./toolbar/FlipVerticalButton";
import DownloadCategoryButton from "./toolbar/DownloadCategoryButton";
import DownloadPhotoLowResButton from "./toolbar/DownloadPhotoLowResButton";
import DownloadPhotoHighResButton from "./toolbar/DownloadPhotoHighResButton";
import ShareButton from "./toolbar/ShareButton";
import RequestMoreButton from "./toolbar/RequestMoreButton";

interface Props {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
    activeMediaIsFirst: boolean;
    activeMediaIsLast: boolean;
    slideshowIsPlaying: boolean;
    canRequestMore: boolean;
    moveNext: () => void;
    movePrevious: () => void;
    toggleSlideshow: () => void;
    requestMore: () => void;
}

const DetailToolbar: Component<Props> = props => {
    const [settings, { setShowBreadcrumbs, setShowMediaList, setThumbnailSize, setDimThumbnails }] =
        useMediaDetailViewSettingsContext();

    const onToggleBreadcrumbs = () => {
        setShowBreadcrumbs(!settings.showBreadcrumbs);
    };

    const onTogglePhotoList = () => {
        setShowMediaList(!settings.showMediaList);
    };

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id);
    };

    const onToggleDimThumbnails = () => {
        setDimThumbnails(!settings.dimThumbnails);
    };

    return (
        <>
            <Show when={props.canRequestMore}>
                <RequestMoreButton requestMore={props.requestMore} />
            </Show>

            <ToggleSlideshowButton
                isPlaying={props.slideshowIsPlaying}
                toggleSlideshow={props.toggleSlideshow}
            />
            <MovePreviousButton
                isFirst={props.activeMediaIsFirst}
                movePrevious={props.movePrevious}
            />
            <MoveNextButton isLast={props.activeMediaIsLast} moveNext={props.moveNext} />

            <ToolbarDivider />

            <DownloadCategoryButton category={props.activeCategory} />

            <ToolbarDivider />

            <RotateCounterClockwiseButton />
            <RotateClockwiseButton />
            <FlipHorizontalButton />
            <FlipVerticalButton />

            <ToolbarDivider />

            <DownloadPhotoLowResButton media={props.activeMedia} />
            <DownloadPhotoHighResButton media={props.activeMedia} />

            <ToolbarDivider />

            <Show
                when={navigator && navigator.canShare && navigator.canShare() && props.activeMedia}
            >
                <ShareButton activeMedia={props.activeMedia!} />

                <ToolbarDivider />
            </Show>

            <ToolbarButton
                icon="icon-[ic--round-title]"
                name="Breadcrumbs"
                tooltip="Toggle Category Breadcrumbs"
                shortcutKeys={["t"]}
                clickHandler={onToggleBreadcrumbs}
            />
            <ToolbarButton
                icon="icon-[ic--round-remove-red-eye]"
                name="Media List"
                tooltip="Toggle Media List"
                shortcutKeys={["l"]}
                clickHandler={onTogglePhotoList}
            />
            <ToolbarButton
                icon="icon-[mdi--image-size-select-large]"
                name="Thumbnail"
                tooltip="Toggle Thumbnail Size"
                shortcutKeys={["s"]}
                clickHandler={onToggleThumbnailSize}
            />
            <ToolbarButton
                icon="icon-[mdi--lightbulb-dimmer-50]"
                name="Dim Thumbnails"
                tooltip="Toggle Thumbnail Dimming"
                shortcutKeys={["b"]}
                clickHandler={onToggleDimThumbnails}
            />
        </>
    );
};

export default DetailToolbar;
