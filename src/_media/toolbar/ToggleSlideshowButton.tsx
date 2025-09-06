import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    isPlaying: boolean;
    toggleSlideshow: () => void;
}

const ToggleSlideshowButton: Component<Props> = props => {
    return (
        <ToolbarButton
            icon={props.isPlaying ? "icon-[ic--round-stop]" : "icon-[ic--round-play-arrow]"}
            name="Slideshow"
            tooltip="Start / Stop Slideshow"
            shortcutKeys={["p"]}
            clickHandler={props.toggleSlideshow}
        />
    );
};

export default ToggleSlideshowButton;
