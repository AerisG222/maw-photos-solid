import { Component, Show } from "solid-js";
import { useParams } from "@solidjs/router";

import { useMediaDetailViewSettingsContext } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { getNextThumbnailSize } from "../_models/ThumbnailSize";

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

const DetailToolbar: Component = () => {
    const [settings, { setShowBreadcrumbs, setShowMediaList, setThumbnailSize }] =
        useMediaDetailViewSettingsContext();
    const params = useParams();

    const onToggleBreadcrumbs = () => {
        setShowBreadcrumbs(!settings.showBreadcrumbs);
    };

    const onTogglePhotoList = () => {
        setShowMediaList(!settings.showMediaList);
    };

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id);
    };

    return (
        <>
            <ToggleSlideshowButton />
            <MovePreviousButton />
            <MoveNextButton />

            <ToolbarDivider />

            <DownloadCategoryButton />

            <ToolbarDivider />

            <RotateCounterClockwiseButton />
            <RotateClockwiseButton />
            <FlipHorizontalButton />
            <FlipVerticalButton />

            <ToolbarDivider />

            <DownloadPhotoLowResButton />
            <DownloadPhotoHighResButton />

            <ToolbarDivider />

            <Show when={navigator?.canShare}>
                <ShareButton />

                <ToolbarDivider />
            </Show>

            <ToolbarButton
                icon="icon-[ic--round-title]"
                name="Breadcrumbs"
                tooltip="Show / Hide Category Breadcrumbs"
                shortcutKeys={["t"]}
                clickHandler={onToggleBreadcrumbs}
            />
            <ToolbarButton
                icon="icon-[ic--round-remove-red-eye]"
                name="Media List"
                tooltip="Show / Hide Media List"
                shortcutKeys={["l"]}
                clickHandler={onTogglePhotoList}
            />
            <ToolbarButton
                icon="icon-[mdi--image-size-select-large]"
                name="Thumbnail"
                tooltip="Toggle Photo List Thumbnail Size"
                shortcutKeys={["s"]}
                clickHandler={onToggleThumbnailSize}
            />
        </>
    );
};

export default DetailToolbar;
