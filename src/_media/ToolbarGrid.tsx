import { Component, Show } from "solid-js";

import { useMediaGridViewSettingsContext } from "../_contexts/settings/MediaGridViewSettingsContext";
import { getNextMarginSize } from "../_models/Margin";
import { getNextThumbnailSize } from "../_models/ThumbnailSize";
import { AreaCategories, AreaRandom } from "../_models/AppRouteDefinition";
import { useRouteDetailContext } from "../_contexts/RouteDetailContext";
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

interface Props {
    activeMedia: Media | undefined;
    activeMediaIsFirst: boolean;
    activeMediaIsLast: boolean;
    slideshowIsPlaying: boolean;
    moveNext: () => void;
    movePrevious: () => void;
    toggleSlideshow: () => void;
}

const GridToolbar: Component<Props> = props => {
    const [routeContext] = useRouteDetailContext();
    const [settings, { setShowBreadcrumbs, setShowMainBreadcrumbs, setThumbnailSize, setMargin }] =
        useMediaGridViewSettingsContext();
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

    return (
        <>
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
                <Show when={routeContext.area === AreaCategories}>
                    <ToolbarButton
                        icon="icon-[ic--round-title]"
                        name="Breadcrumbs"
                        tooltip="Show / Hide Category Breadcrumbs"
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
            </Show>

            <Show when={props.activeMedia}>
                <Show when={routeContext.area === AreaRandom}>
                    <ToolbarButton
                        icon="icon-[ic--round-title]"
                        name="Breadcrumbs"
                        tooltip="Show / Hide Category Breadcrumbs"
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
