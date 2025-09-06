import { Component } from "solid-js";

import { Media } from "../_models/Media";

interface Props {
    media: Media;
    setActiveMediaElement: (el: HTMLImageElement) => void;
}

const MainPhoto: Component<Props> = props => {
    const getUrl = () => props.media.files.find(f => f.scale === "full-hd")?.path;

    return (
        <img
            src={getUrl()}
            crossorigin="anonymous" // this is required for the histogram (maybe only in dev?)
            class="w-full h-full max-h-screen max-w-full object-contain"
            sizes="100vw"
            loading="eager"
            ref={el => props.setActiveMediaElement(el)}
        />
    );
};

export default MainPhoto;
