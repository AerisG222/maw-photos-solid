import { Component } from "solid-js";

import { useSlideshowContext } from "../contexts/SlideshowContext";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const ToggleSlideshowButton: Component = () => {
    const [state, { toggle }] = useSlideshowContext();

    return (
        <ToolbarButton
            icon={state.isPlaying ? "icon-[ic--round-stop]" : "icon-[ic--round-play-arrow]"}
            name="Start / Stop Slideshow"
            shortcutKeys={["p"]}
            clickHandler={toggle}
        />
    );
};

export default ToggleSlideshowButton;
