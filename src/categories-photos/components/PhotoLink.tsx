import { Component } from 'solid-js';

import { Photo } from '../../models/Media';
import { ThumbnailSizeIdType, getThumbnailClass } from '../../models/ThumbnailSize';
import { getPhotoCategoryRoutePath } from '../_routes';
import { AppRouteDefinition } from '../../models/AppRouteDefinition';

import MediaLink from './MediaLink';

export type Props = {
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

    return (
        <MediaLink
            media={props.photo}
            scroll={props.scroll}
            url={getPhotoCategoryRoutePath(props.route, props.photo.categoryId, props.photo.id)}
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
