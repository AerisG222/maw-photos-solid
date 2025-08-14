import { Component, Show } from "solid-js";
import { useParams } from "@solidjs/router";

import { useMediaGridViewSettingsContext } from "../contexts/settings/MediaGridViewSettingsContext";
import { getNextMarginSize } from "../_models/Margin";
import { getNextThumbnailSize } from "../_models/ThumbnailSize";
import { useMediaListContext } from "./contexts/MediaListContext";
import { CategoryType } from "../_models/CategoryType";
import { AreaCategories, AreaRandom } from "../_models/AppRouteDefinition";
import { useRouteDetailContext } from "../contexts/RouteDetailContext";

import ToolbarButton from "../components/toolbar/ToolbarButton";
import ToolbarDivider from "../components/toolbar/ToolbarDivider";
import MovePreviousButton from "./toolbar/MovePreviousButton";
import MoveNextButton from "./toolbar/MoveNextButton";
import ToggleSlideshowButton, { showSlideshowButton } from "./toolbar/ToggleSlideshowButton";
import RotateCounterClockwiseButton from "./toolbar/RotateCounterClockwiseButton";
import RotateClockwiseButton from "./toolbar/RotateClockwiseButton";
import FlipHorizontalButton from "./toolbar/FlipHorizontalButton";
import FlipVerticalButton from "./toolbar/FlipVerticalButton";
import { useMediaBreakpointContext } from "../contexts/MediaBreakpointContext";

const GridToolbar: Component = () => {
    const [routeContext] = useRouteDetailContext();
    const [settings, { setShowBreadcrumbs, setShowMainBreadcrumbs, setThumbnailSize, setMargin }] =
        useMediaGridViewSettingsContext();
    const [, { ltMd }] = useMediaBreakpointContext();
    const [state] = useMediaListContext();
    const params = useParams();

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
            <ToggleSlideshowButton />

            <Show when={state.activeItem && !ltMd()}>
                <MovePreviousButton />
                <MoveNextButton />
            </Show>

            <Show
                when={
                    (state.activeItem && !ltMd()) ||
                    showSlideshowButton(routeContext.area, params.categoryType as CategoryType)
                }
            >
                <ToolbarDivider />
            </Show>

            <Show when={!state.activeItem}>
                <Show when={routeContext.area === AreaCategories}>
                    <ToolbarButton
                        icon="icon-[ic--round-title]"
                        name="Show / Hide Category Breadcrumbs"
                        shortcutKeys={["t"]}
                        clickHandler={onToggleBreadcrumbs}
                    />
                </Show>

                <ToolbarButton
                    icon="icon-[ic--round-photo-size-select-large]"
                    name="Toggle Thumbnail Size"
                    shortcutKeys={["s"]}
                    clickHandler={onToggleThumbnailSize}
                />

                <ToolbarButton
                    icon="icon-[ic--round-format-indent-increase]"
                    name="Toggle Margins"
                    shortcutKeys={["m"]}
                    clickHandler={onToggleMargins}
                />
            </Show>

            <Show when={state.activeItem}>
                <Show when={routeContext.area === AreaRandom}>
                    <ToolbarButton
                        icon="icon-[ic--round-title]"
                        name="Show / Hide Category Breadcrumbs"
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
