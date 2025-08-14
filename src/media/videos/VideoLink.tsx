import { Component } from "solid-js";

import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { Video, Media } from "../../_models/Media";
import { ThumbnailSizeIdType, getThumbnailSize } from "../../_models/ThumbnailSize";
import { getMediaPath } from "../_routes";
import { CategoryTypeVideos } from "../../_models/CategoryType";

import MediaLink from "../MediaLink";

type Props = {
    video: Video;
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
        "rounded-1": props.rounded
    });

    // todo: make category type dynamic?
    return (
        <MediaLink
            media={props.video}
            scroll={props.scroll}
            url={getMediaPath(
                props.route,
                CategoryTypeVideos,
                props.video.categoryId,
                props.video.id
            )}
            rounded={props.rounded}
            isActiveItem={props.isActiveItem}
        >
            <img
                src={props.video.thumbnailSqUrl}
                width={getThumbnailSize(props.thumbnailSize).width}
                height={getThumbnailSize(props.thumbnailSize).height}
                classList={getClassList()}
                loading={props.eager ? "eager" : "lazy"}
            />
        </MediaLink>
    );
};

export default VideoLink;
