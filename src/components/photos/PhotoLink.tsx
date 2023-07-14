import { Component } from 'solid-js';

import { Photo } from '../../models/Media';
import { ThumbnailSizeIdType, getThumbnailClass } from '../../models/ThumbnailSize';
import { AppRouteDefinition } from '../../models/AppRouteDefinition';
import { getMediaPath } from '../../media/_routes';
import { CategoryTypePhoto } from '../../models/CategoryType';

import MediaLink from '../../media/MediaLink';

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
            url={getMediaPath(props.route, CategoryTypePhoto, props.photo.categoryId, props.photo.id)}
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
