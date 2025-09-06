import { Component } from "solid-js";

interface Props {
    url: string;
    setActiveMediaElement: (el: HTMLImageElement) => void;
}

const MainPhoto: Component<Props> = props => {
    return (
        <img
            crossorigin="anonymous" // this is required for the histogram (maybe only in dev?)
            class="w-full h-full max-h-screen max-w-full object-contain"
            sizes="100vw"
            loading="eager"
            src={props.url}
            ref={el => props.setActiveMediaElement(el)}
        />
    );
};

export default MainPhoto;
