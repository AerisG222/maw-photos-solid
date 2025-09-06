import { Component } from "solid-js";

interface Props {
    url: string;
    setActiveMediaElement: (el: HTMLVideoElement) => void;
}

const MainVideo: Component<Props> = props => {
    return (
        <video
            crossorigin="anonymous" // this is required for the histogram (maybe only in dev?)
            class="h-full w-full center-block m-auto"
            autoplay={false}
            controls
            src={props.url}
            ref={el => props.setActiveMediaElement(el)}
        />
    );
};

export default MainVideo;
