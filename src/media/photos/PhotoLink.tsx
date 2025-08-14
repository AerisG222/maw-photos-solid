import { Component } from "solid-js";

import { Media, Photo } from "../../_models/Media";
import { ThumbnailSizeIdType, getThumbnailSize } from "../../_models/ThumbnailSize";
import { AppRouteDefinition } from "../../_models/AppRouteDefinition";
import { getMediaPath } from "../_routes";
import { CategoryTypePhotos } from "../../_models/CategoryType";

import MediaLink from "../MediaLink";

type Props = {
    photo: Photo;
    thumbnailSize: ThumbnailSizeIdType;
    rounded: boolean;
    isActiveItem: boolean;
    route: AppRouteDefinition;
    eager: boolean;
    scroll?: (el: HTMLAnchorElement, media: Media) => void;
};

const PhotoLink: Component<Props> = props => {
    const getClassList = () => ({
        "max-w-none": true,
        "rounded-1": props.rounded
    });

    /// todo: make category type dynamic
    return (
        <MediaLink
            media={props.photo}
            scroll={props.scroll}
            url={getMediaPath(
                props.route,
                CategoryTypePhotos,
                props.photo.categoryId,
                props.photo.id
            )}
            rounded={props.rounded}
            isActiveItem={props.isActiveItem}
        >
            <img
                src={props.photo.imageXsSqUrl}
                width={getThumbnailSize(props.thumbnailSize).width}
                height={getThumbnailSize(props.thumbnailSize).height}
                classList={getClassList()}
                loading={props.eager ? "eager" : "lazy"}
            />
        </MediaLink>
    );
};

export default PhotoLink;
