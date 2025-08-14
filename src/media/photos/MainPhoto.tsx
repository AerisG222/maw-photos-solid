import { Component } from "solid-js";

import { Photo } from "../../_models/Media";
import { useMediaListContext } from "../contexts/MediaListContext";

type Props = {
    photo: Photo;
};

const MainPhoto: Component<Props> = props => {
    const [, { setMediaElement }] = useMediaListContext();

    const getSrcset = () => {
        const set = [];

        if (props.photo) {
            set.push(`${props.photo.imageXsUrl} ${props.photo.imageXsWidth}w`);
            set.push(`${props.photo.imageSmUrl} ${props.photo.imageSmWidth}w`);
            set.push(`${props.photo.imageMdUrl} ${props.photo.imageMdWidth}w`);
            set.push(`${props.photo.imageLgUrl} ${props.photo.imageLgWidth}w`);
        }

        return set.join(", ");
    };

    return (
        <img
            src={props.photo?.imageMdUrl}
            crossorigin="anonymous" // this is required for the histogram (maybe only in dev?)
            class="h-100% w-100% max-h-100vh max-w-100% object-contain"
            srcset={getSrcset()}
            sizes="100vw"
            loading="eager"
            ref={el => setMediaElement(el)}
        />
    );
};

export default MainPhoto;
