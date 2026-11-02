import { Component } from "solid-js";

interface Props {
    url: string;
    setActiveMediaElement: (el: HTMLVideoElement) => void;
}

const MainVideo: Component<Props> = props => {
    return (
        <video
            crossorigin="use-credentials" // cors for the histogram, credentials for the asset cookie
            class="h-full w-full center-block m-auto"
            autoplay={false}
            controls
            src={props.url}
            ref={el => props.setActiveMediaElement(el)}
        />
    );
};

export default MainVideo;
