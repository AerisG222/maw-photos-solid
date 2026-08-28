import { Component, JSXElement, Show, children } from "solid-js";

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
import RequestMoreButton from "../_components/toolbar/RequestMoreButton";
import ToggleHighlightFacesButton from "./toolbar/ToggleHighlightFacesButton";
import ToggleShowFavoritesBadgeButton from "./toolbar/ToggleShowFavoritesButton";
import ToggleShowTypesBadgeButton from "./toolbar/ToggleShowTypesButton";

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
    setShowFavoritesBadge: () => void;
    setShowTypesBadge: () => void;
    /*
       Controls belonging to the feed rather than to this view - a person's
       favorites filter and shuffle. First in the group, ahead of request more
       and the slideshow: they decide *what* the list holds, which outranks
       moving around inside it.
    */
    extras?: JSXElement;
}

const GridToolbar: Component<Props> = props => {
    const [
        settings,
        {
            setShowBreadcrumbs,
            setShowMainBreadcrumbs,
            setThumbnailSize,
            setMargin,
            setDimThumbnails,
            setHighlightFaces
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

    /*
       Resolved once. Reading a JSX prop twice - here and in the Show below -
       builds the component twice, and each copy registers its own keyboard
       shortcuts, so the filter keys would fire in pairs and cancel out.
    */
    const extras = children(() => props.extras);

    return (
        <>
            {extras()}

            {/* a group of their own: they decide what the listing holds, where
                everything after them acts on what is already in it */}
            <Show when={extras()}>
                <ToolbarDivider />
            </Show>

            <RequestMoreButton disabled={!props.canRequestMore} requestMore={props.requestMore} />

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

            <ToggleShowFavoritesBadgeButton
                isActive={settings.showFavoritesBadge}
                setShowFavoritesBadge={props.setShowFavoritesBadge}
            />
            <ToggleShowTypesBadgeButton
                isActive={settings.showTypesBadge}
                setShowTypesBadge={props.setShowTypesBadge}
            />
            <ToggleHighlightFacesButton
                isActive={settings.highlightFaces}
                setHighlightFaces={() => setHighlightFaces(!settings.highlightFaces)}
            />

            <ToolbarDivider />

            <Show when={!props.activeMedia}>
                <Show when={props.enableToggleBreadcrumbsOnInactiveMedia}>
                    <ToolbarButton
                        icon="icon-[ic--round-title]"
                        name="Breadcrumbs"
                        tooltip="Toggle Category Breadcrumbs"
                        shortcutKeys={["t"]}
                        clickHandler={onToggleBreadcrumbs}
                        active={settings.showBreadcrumbs}
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
                    active={!settings.dimThumbnails}
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
