import { Component, JSXElement, Show } from "solid-js";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { getNextThumbnailSize } from "../_models/ThumbnailSize";
import { Category } from "../_models/Category";
import { Media } from "../_models/Media";

import ToolbarButton from "../_components/toolbar/ToolbarButton";
import ToggleHighlightFacesButton from "./toolbar/ToggleHighlightFacesButton";
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
import ToggleShowFavoritesBadgeButton from "./toolbar/ToggleShowFavoritesButton";

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
    setShowFavoritesBadge: () => void;
    /*
       Controls belonging to the feed rather than to this view - a person's
       favorites filter and shuffle. First in the group, ahead of request more
       and the slideshow: they decide *what* the list holds, which outranks
       moving around inside it.
    */
    extras?: JSXElement;
}

const DetailToolbar: Component<Props> = props => {
    const [
        settings,
        {
            setShowBreadcrumbs,
            setShowMediaList,
            setThumbnailSize,
            setDimThumbnails,
            setHighlightFaces
        }
    ] = useMediaDetailViewSettingsContext();

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
            {props.extras}

            <RequestMoreButton disabled={!props.canRequestMore} requestMore={props.requestMore} />

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

            <Show when={navigator?.canShare?.() && props.activeMedia}>
                <ShareButton activeMedia={props.activeMedia!} />

                <ToolbarDivider />
            </Show>

            <ToggleHighlightFacesButton
                isActive={settings.highlightFaces}
                setHighlightFaces={() => setHighlightFaces(!settings.highlightFaces)}
            />

            <ToolbarButton
                icon="icon-[ic--round-title]"
                name="Breadcrumbs"
                tooltip="Toggle Category Breadcrumbs"
                shortcutKeys={["t"]}
                clickHandler={onToggleBreadcrumbs}
                active={settings.showBreadcrumbs}
            />
            <ToolbarButton
                icon="icon-[ic--round-remove-red-eye]"
                name="Media List"
                tooltip="Toggle Media List"
                shortcutKeys={["l"]}
                clickHandler={onTogglePhotoList}
                active={settings.showMediaList}
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
                active={!settings.dimThumbnails}
            />

            <ToggleShowFavoritesBadgeButton
                isActive={settings.showFavoritesBadge}
                setShowFavoritesBadge={props.setShowFavoritesBadge}
            />
        </>
    );
};

export default DetailToolbar;
