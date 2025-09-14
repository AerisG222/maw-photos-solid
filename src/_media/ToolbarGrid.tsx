import { Component, Show } from "solid-js";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { getNextMarginSize } from "../_models/Margin";
import { getNextThumbnailSize } from "../_models/ThumbnailSize";
import { useMediaBreakpointContext } from "../_contexts/MediaBreakpointContext";
import { Media } from "../_models/Media";

import ToolbarButton from "../_components/toolbar/ToolbarButton";
import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import MovePreviousButton from "./toolbar/MovePreviousButton";
import MoveNextButton from "./toolbar/MoveNextButton";
import ToggleSlideshowButton from "./toolbar/ToggleSlideshowButton";
import RotateCounterClockwiseButton from "./toolbar/RotateCounterClockwiseButton";
import RotateClockwiseButton from "./toolbar/RotateClockwiseButton";
import FlipHorizontalButton from "./toolbar/FlipHorizontalButton";
import FlipVerticalButton from "./toolbar/FlipVerticalButton";
import RequestMoreButton from "./toolbar/RequestMoreButton";

interface Props {
    activeMedia: Media | undefined;
    activeMediaIsFirst: boolean;
    activeMediaIsLast: boolean;
    slideshowIsPlaying: boolean;
    enableToggleBreadcrumbsOnActiveMedia: boolean;
    enableToggleBreadcrumbsOnInactiveMedia: boolean;
    canRequestMore: boolean;
    moveNext: () => void;
    movePrevious: () => void;
    toggleSlideshow: () => void;
    requestMore: () => void;
}

const GridToolbar: Component<Props> = props => {
    const [
        settings,
        {
            setShowBreadcrumbs,
            setShowMainBreadcrumbs,
            setThumbnailSize,
            setMargin,
            setDimThumbnails
        }
    ] = useMediaGridViewSettingsContext();
    const [, { ltMd }] = useMediaBreakpointContext();

    const onToggleBreadcrumbs = () => {
        setShowBreadcrumbs(!settings.showBreadcrumbs);
    };

    const onToggleMainBreadcrumbs = () => {
        setShowMainBreadcrumbs(!settings.showMainBreadcrumbs);
    };

    const onToggleThumbnailSize = () => {
        setThumbnailSize(getNextThumbnailSize(settings.thumbnailSize).id);
    };

    const onToggleMargins = () => {
        setMargin(getNextMarginSize(settings.margin).id);
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

            <Show when={props.activeMedia && !ltMd()}>
                <MovePreviousButton
                    isFirst={props.activeMediaIsFirst}
                    movePrevious={props.movePrevious}
                />
                <MoveNextButton isLast={props.activeMediaIsLast} moveNext={props.moveNext} />
            </Show>

            <ToolbarDivider />

            <Show when={!props.activeMedia}>
                <Show when={props.enableToggleBreadcrumbsOnInactiveMedia}>
                    <ToolbarButton
                        icon="icon-[ic--round-title]"
                        name="Breadcrumbs"
                        tooltip="Toggle Category Breadcrumbs"
                        shortcutKeys={["t"]}
                        clickHandler={onToggleBreadcrumbs}
                    />
                </Show>

                <ToolbarButton
                    icon="icon-[ic--round-photo-size-select-large]"
                    name="Thumbnails"
                    tooltip="Toggle Thumbnail Size"
                    shortcutKeys={["s"]}
                    clickHandler={onToggleThumbnailSize}
                />

                <ToolbarButton
                    icon="icon-[ic--round-format-indent-increase]"
                    name="Margins"
                    tooltip="Toggle Margins"
                    shortcutKeys={["m"]}
                    clickHandler={onToggleMargins}
                />

                <ToolbarButton
                    icon="icon-[mdi--lightbulb-dimmer-50]"
                    name="Dim Thumbnails"
                    tooltip="Toggle Thumbnail Dimming"
                    shortcutKeys={["b"]}
                    clickHandler={onToggleDimThumbnails}
                />
            </Show>

            <Show when={props.activeMedia}>
                <Show when={props.enableToggleBreadcrumbsOnActiveMedia}>
                    <ToolbarButton
                        icon="icon-[ic--round-title]"
                        name="Breadcrumbs"
                        tooltip="Toggle Category Breadcrumbs"
                        shortcutKeys={["t"]}
                        clickHandler={onToggleMainBreadcrumbs}
                    />
                </Show>

                <RotateCounterClockwiseButton />
                <RotateClockwiseButton />
                <FlipHorizontalButton />
                <FlipVerticalButton />
            </Show>
        </>
    );
};

export default GridToolbar;
