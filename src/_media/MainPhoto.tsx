import { Component } from "solid-js";

interface Props {
    url: string;
    // what is in the photograph, where anything is known about it
    alt?: string;
    setActiveMediaElement: (el: HTMLImageElement) => void;
}

const MainPhoto: Component<Props> = props => {
    return (
        <img
            crossorigin="anonymous" // this is required for the histogram (maybe only in dev?)
            alt={props.alt ?? ""}
            class="w-full h-full max-h-dvh max-w-full object-contain"
            sizes="100vw"
            loading="eager"
            src={props.url}
            ref={el => props.setActiveMediaElement(el)}
        />
    );
};

export default MainPhoto;
