import { Component, Show } from "solid-js";

import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import MoveNextButton from "./toolbar/MoveNextButton";
import MovePreviousButton from "./toolbar/MovePreviousButton";
import ToggleSlideshowButton from "./toolbar/ToggleSlideshowButton";
import RotateCounterClockwiseButton from "./toolbar/RotateCounterClockwiseButton";
import RotateClockwiseButton from "./toolbar/RotateClockwiseButton";
import FlipHorizontalButton from "./toolbar/FlipHorizontalButton";
import FlipVerticalButton from "./toolbar/FlipVerticalButton";
import RequestMoreButton from "./toolbar/RequestMoreButton";
import ToggleShowFavoritesBadgeButton from "./toolbar/ToggleShowFavoritesButton";

interface Props {
    activeMediaIsFirst: boolean;
    activeMediaIsLast: boolean;
    slideshowIsPlaying: boolean;
    canRequestMore: boolean;
    moveNext: () => void;
    movePrevious: () => void;
    toggleSlideshow: () => void;
    requestMore: () => void;
    setShowFavoritesBadge: () => void;
}

const FullscreenToolbar: Component<Props> = props => {
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

            <RotateCounterClockwiseButton />
            <RotateClockwiseButton />
            <FlipHorizontalButton />
            <FlipVerticalButton />

            <ToolbarDivider />

            <ToggleShowFavoritesBadgeButton setShowFavoritesBadge={props.setShowFavoritesBadge} />
        </>
    );
};

export default FullscreenToolbar;
