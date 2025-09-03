import { Component } from "solid-js";

import { Media } from "../_models/Media";

type Props = {
    media: Media;
    setActiveMediaElement: (el: HTMLVideoElement) => void;
};

const MainVideo: Component<Props> = props => {
    const getVideoUrl = () => props.media.files.find(f => f.scale === "full-hd")?.path;

    return (
        <video
            class="h-full w-full center-block m-auto"
            crossorigin="anonymous" // this is required for the histogram (maybe only in dev?)
            autoplay={false}
            controls
            src={getVideoUrl()}
            ref={el => props.setActiveMediaElement(el)}
        />
    );
};

export default MainVideo;
