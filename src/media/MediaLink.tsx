import { Component } from "solid-js";
import { A } from "@solidjs/router";

import { Media } from "../_models/Media";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { getThumbnailSize, ThumbnailSizeIdType } from "../_models/ThumbnailSize";
import { getMediaPath } from "./_routes";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";

type Props = {
    media: Media;
    thumbnailSize: ThumbnailSizeIdType;
    rounded: boolean;
    isActiveItem: boolean;
    route: AppRouteDefinition;
    eager: boolean;
    scroll?: (el: HTMLAnchorElement, media: Media) => void;
};

const MediaLink: Component<Props> = props => {
    const getClassList = () => {
        return {
            "cursor-pointer": true,
            "mr-[0.1rem]": true,
            "saturate-20": true,
            "hover:saturate-100": true,
            "border-1": true,
            "border-transparent": true,
            "hover:border-primary": true,
            "rounded-md": props.rounded,
            "saturate-100!": props.isActiveItem,
            "border-primary!": props.isActiveItem
        };
    };

    const getImgClassList = () => ({
        "max-w-none": true,
        "rounded-md": props.rounded
    });

    return (
        <A
            classList={getClassList()}
            href={getMediaPath(props.route, props.media.categoryId, props.media.id)}
            ref={el => (props.scroll ? props.scroll(el, props.media) : () => {})}
        >
            <img
                src={getMediaTeaserUrl(props.media, props.thumbnailSize)}
                width={getThumbnailSize(props.thumbnailSize).width}
                height={getThumbnailSize(props.thumbnailSize).height}
                classList={getImgClassList()}
                loading={props.eager ? "eager" : "lazy"}
            />
        </A>
    );
};

export default MediaLink;
