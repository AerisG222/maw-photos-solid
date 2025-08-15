import { Component } from "solid-js";

import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import MoveNextButton from "./toolbar/MoveNextButton";
import MovePreviousButton from "./toolbar/MovePreviousButton";
import ToggleSlideshowButton from "./toolbar/ToggleSlideshowButton";
import RotateCounterClockwiseButton from "./toolbar/RotateCounterClockwiseButton";
import RotateClockwiseButton from "./toolbar/RotateClockwiseButton";
import FlipHorizontalButton from "./toolbar/FlipHorizontalButton";
import FlipVerticalButton from "./toolbar/FlipVerticalButton";

const FullscreenToolbar: Component = () => {
    return (
        <>
            <ToggleSlideshowButton />
            <MovePreviousButton />
            <MoveNextButton />

            <ToolbarDivider />

            <RotateCounterClockwiseButton />
            <RotateClockwiseButton />
            <FlipHorizontalButton />
            <FlipVerticalButton />
        </>
    );
};

export default FullscreenToolbar;
