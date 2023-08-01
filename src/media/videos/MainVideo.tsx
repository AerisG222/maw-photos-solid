import { Component, createSignal, onMount } from "solid-js";

import { Video } from "../../_models/Media";
import { useMediaListContext } from "../contexts/MediaListContext";

type Props = {
    video: Video;
};

const MainVideo: Component<Props> = (props) => {
    const [useLarge, setUseLarge] = createSignal(true);
    const [, { setMediaElement }] = useMediaListContext();

    const getVideoUrl = (video: Video) =>
        useLarge() ?
            video.videoFullUrl :
            video.videoScaledUrl;

    onMount(() => {
        setUseLarge(document.body.clientWidth >= 1500);
    });

    return (
        <video
            class="h-100% w-100% center-block m-auto"
            crossorigin="anonymous"  // this is required for the histogram (maybe only in dev?)
            autoplay={false}
            controls
            src={getVideoUrl(props.video)}
            ref={el => setMediaElement(el)}
        />
    );
};

export default MainVideo;
