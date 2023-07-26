import { Component } from 'solid-js';

import { Media, Photo } from '../../_models/Media';
import { ThumbnailSizeIdType, getThumbnailClass } from '../../_models/ThumbnailSize';
import { AppRouteDefinition } from '../../_models/AppRouteDefinition';
import { getMediaPath } from '../_routes';
import { CategoryTypePhotos } from '../../_models/CategoryType';

import MediaLink from '../MediaLink';

type Props = {
    photo: Photo;
    thumbnailSize: ThumbnailSizeIdType;
    rounded: boolean;
    isActiveItem: boolean;
    route: AppRouteDefinition
    scroll?: (el: HTMLAnchorElement, media: Media) => void;
};

const PhotoLink: Component<Props> = (props) => {
    const getClassList = () => ({
        ...getThumbnailClass(props.thumbnailSize),
        ...{
            'max-w-none': true,
            'rounded-1': props.rounded
        }
    });

    /// todo: make category type dynamic
    return (
        <MediaLink
            media={props.photo}
            scroll={props.scroll}
            url={getMediaPath(props.route, CategoryTypePhotos, props.photo.categoryId, props.photo.id)}
            rounded={props.rounded}
            isActiveItem={props.isActiveItem}>
            <img
                src={props.photo.imageXsSqUrl}
                classList={getClassList()}
                loading="lazy" />
        </MediaLink>
    );
};

export default PhotoLink;