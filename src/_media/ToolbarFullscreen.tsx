import { Component, JSXElement, Show, children } from "solid-js";

import { useMediaFullscreenViewSettingsContext } from "../_contexts/settings/MediaFullscreenViewSettingsContext";

import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import MoveNextButton from "./toolbar/MoveNextButton";
import MovePreviousButton from "./toolbar/MovePreviousButton";
import ToggleSlideshowButton from "./toolbar/ToggleSlideshowButton";
import RotateCounterClockwiseButton from "./toolbar/RotateCounterClockwiseButton";
import RotateClockwiseButton from "./toolbar/RotateClockwiseButton";
import FlipHorizontalButton from "./toolbar/FlipHorizontalButton";
import FlipVerticalButton from "./toolbar/FlipVerticalButton";
import RequestMoreButton from "../_components/toolbar/RequestMoreButton";
import ToggleHighlightFacesButton from "./toolbar/ToggleHighlightFacesButton";
import ToggleShowFavoritesBadgeButton from "./toolbar/ToggleShowFavoritesButton";

interface Props {
    activeMediaIsFirst: boolean;
    activeMediaIsLast: boolean;
    slideshowIsPlaying: boolean;
    canRequestMore: boolean;
    showFavoritesBadge: boolean;
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

const FullscreenToolbar: Component<Props> = props => {
    // its own view's settings, the way the grid and detail toolbars read theirs.
    // the favorites badge arrives as a prop only because it predates this
    const [settings, { setHighlightFaces }] = useMediaFullscreenViewSettingsContext();

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
            <MovePreviousButton
                isFirst={props.activeMediaIsFirst}
                movePrevious={props.movePrevious}
            />
            <MoveNextButton isLast={props.activeMediaIsLast} moveNext={props.moveNext} />

            <ToolbarDivider />

            <RotateCounterClockwiseButton />
            <RotateClockwiseButton />
            <FlipHorizontalButton />
            <FlipVerticalButton />

            <ToolbarDivider />

            <ToggleShowFavoritesBadgeButton
                isActive={props.showFavoritesBadge}
                setShowFavoritesBadge={props.setShowFavoritesBadge}
            />
            <ToggleHighlightFacesButton
                isActive={settings.highlightFaces}
                setHighlightFaces={() => setHighlightFaces(!settings.highlightFaces)}
            />
        </>
    );
};

export default FullscreenToolbar;
