import { Component } from "solid-js";

import { useMediaListContext } from "./contexts/MediaListContext";
import { Media } from "../_models/Media";

type Props = {
    media: Media;
};

const MainPhoto: Component<Props> = props => {
    const [, { setMediaElement }] = useMediaListContext();

    const getUrl = () => props.media.files.find(f => f.scale === "full-hd")?.path;

    return (
        <img
            src={getUrl()}
            crossorigin="anonymous" // this is required for the histogram (maybe only in dev?)
            class="w-full h-full max-h-screen max-w-full object-contain"
            sizes="100vw"
            loading="eager"
            ref={el => setMediaElement(el)}
        />
    );
};

export default MainPhoto;
