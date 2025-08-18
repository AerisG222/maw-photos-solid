import { Component, createSignal, onMount } from "solid-js";

import { Media } from "../../_models/Media";
import { useMediaListContext } from "../contexts/MediaListContext";

type Props = {
    media: Media;
};

const MainVideo: Component<Props> = props => {
    const [useLarge, setUseLarge] = createSignal(true);
    const [, { setMediaElement }] = useMediaListContext();

    const getVideoUrl = (video: Media) => "TODO"; //(useLarge() ? video.videoFullUrl : video.videoScaledUrl);

    onMount(() => {
        setUseLarge(document.body.clientWidth >= 1500);
    });

    return (
        <video
            class="h-100% w-full center-block m-auto"
            crossorigin="anonymous" // this is required for the histogram (maybe only in dev?)
            autoplay={false}
            controls
            src={getVideoUrl(props.media)}
            ref={el => setMediaElement(el)}
        />
    );
};

export default MainVideo;
