import { Component } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";
import { Media } from "../../_models/Media";

type Props = {
    media: Media;
};

const MainPhoto: Component<Props> = props => {
    const [, { setMediaElement }] = useMediaListContext();

    const getSrcset = () => {
        const set: string[] = [];

        // if (props.media) {
        //     set.push(`${props.media.imageXsUrl} ${props.media.imageXsWidth}w`);
        //     set.push(`${props.media.imageSmUrl} ${props.media.imageSmWidth}w`);
        //     set.push(`${props.media.imageMdUrl} ${props.media.imageMdWidth}w`);
        //     set.push(`${props.media.imageLgUrl} ${props.media.imageLgWidth}w`);
        // }

        return set.join(", ");
    };

    return (
        <img
            src={"TODO" /*props.media?.imageMdUrl*/}
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
