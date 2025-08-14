import { Component, Show } from "solid-js";
import { useParams } from "@solidjs/router";

import { useMediaDetailViewSettingsContext } from "../contexts/settings/MediaDetailViewSettingsContext";
import { getNextThumbnailSize } from "../_models/ThumbnailSize";

import ToolbarButton from "../components/toolbar/ToolbarButton";
import ToolbarDivider from "../components/toolbar/ToolbarDivider";
import ToggleSlideshowButton from "./toolbar/ToggleSlideshowButton";
import MovePreviousButton from "./toolbar/MovePreviousButton";
import MoveNextButton from "./toolbar/MoveNextButton";
import RotateCounterClockwiseButton from "./toolbar/RotateCounterClockwiseButton";
import RotateClockwiseButton from "./toolbar/RotateClockwiseButton";
import FlipHorizontalButton from "./toolbar/FlipHorizontalButton";
import FlipVerticalButton from "./toolbar/FlipVerticalButton";
import DownloadCategoryButton from "./toolbar/DownloadCategoryButton";
import DownloadPhotoLowResButton from "./toolbar/DownloadPhotoLowResButton";
import DownloadPhotoMediumResButton from "./toolbar/DownloadPhotoMediumResButton";
import DownloadPhotoHighResButton from "./toolbar/DownloadPhotoHighResButton";
import DownloadPhotoHighUntouchedButton from "./toolbar/DownloadPhotoHighUntouchedButton";
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
            <DownloadPhotoMediumResButton />
            <DownloadPhotoHighResButton />
            <DownloadPhotoHighUntouchedButton />

            <ToolbarDivider />

            <Show when={navigator?.canShare}>
                <ShareButton />

                <ToolbarDivider />
            </Show>

            <ToolbarButton
                icon="icon-[ic--round-title]"
                name="Show / Hide Category Breadcrumbs"
                shortcutKeys={["t"]}
                clickHandler={onToggleBreadcrumbs}
            />
            <ToolbarButton
                icon="icon-[ic--round-remove-red-eye]"
                name="Show / Hide Photo List"
                shortcutKeys={["l"]}
                clickHandler={onTogglePhotoList}
            />
            <ToolbarButton
                icon="icon-[mdi--image-size-select-large]"
                name="Toggle Photo List Thumbnail Size"
                shortcutKeys={["s"]}
                clickHandler={onToggleThumbnailSize}
            />
        </>
    );
};

export default DetailToolbar;
