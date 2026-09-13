import { Component, JSXElement, Show, children } from "solid-js";

import { useMediaBreakpointContext } from "../_contexts/MediaBreakpointContext";
import { Media } from "../_models/Media";

import ListingToolbar from "../_components/listing/ListingToolbar";
import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import MovePreviousButton from "./toolbar/MovePreviousButton";
import MoveNextButton from "./toolbar/MoveNextButton";
import ToggleSlideshowButton from "./toolbar/ToggleSlideshowButton";
import RotateCounterClockwiseButton from "./toolbar/RotateCounterClockwiseButton";
import RotateClockwiseButton from "./toolbar/RotateClockwiseButton";
import FlipHorizontalButton from "./toolbar/FlipHorizontalButton";
import FlipVerticalButton from "./toolbar/FlipVerticalButton";
import RequestMoreButton from "../_components/toolbar/RequestMoreButton";

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
    /*
       Controls belonging to the feed rather than to this view - a person's
       favorites filter and shuffle. First in the group, ahead of request more
       and the slideshow: they decide *what* the list holds, which outranks
       moving around inside it.
    */
    extras?: JSXElement;
}

const GridToolbar: Component<Props> = props => {
    const [, { ltMd }] = useMediaBreakpointContext();

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

            <ListingToolbar badges faces />

            <ToolbarDivider />

            {/* the grid's own geometry, which an opened photo is not laid out by */}
            <Show when={!props.activeMedia}>
                <ListingToolbar density dim />
            </Show>

            <Show when={props.activeMedia}>
                <RotateCounterClockwiseButton />
                <RotateClockwiseButton />
                <FlipHorizontalButton />
                <FlipVerticalButton />
            </Show>
        </>
    );
};

export default GridToolbar;
