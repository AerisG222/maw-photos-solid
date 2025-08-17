import { Component } from "solid-js";

import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { Media } from "../../_models/Media";
import { ThumbnailSizeIdType, getThumbnailSize } from "../../_models/ThumbnailSize";
import { getMediaPath } from "../_routes";

import MediaLink from "../MediaLink";

type Props = {
    media: Media;
    thumbnailSize: ThumbnailSizeIdType;
    rounded: boolean;
    isActiveItem: boolean;
    route: AppRouteDefinition;
    eager: boolean;
    scroll?: (el: HTMLAnchorElement, media: Media) => void;
};

const VideoLink: Component<Props> = props => {
    const getClassList = () => ({
        "max-w-none": true,
        "rounded-md": props.rounded
    });

    // todo: make category type dynamic?
    return (
        <MediaLink
            media={props.media}
            scroll={props.scroll}
            url={getMediaPath(props.route, props.media.categoryId, props.media.id)}
            rounded={props.rounded}
            isActiveItem={props.isActiveItem}
        >
            <img
                src={"TODO" /*props.media.thumbnailSqUrl*/}
                width={getThumbnailSize(props.thumbnailSize).width}
                height={getThumbnailSize(props.thumbnailSize).height}
                classList={getClassList()}
                loading={props.eager ? "eager" : "lazy"}
            />
        </MediaLink>
    );
};

export default VideoLink;
