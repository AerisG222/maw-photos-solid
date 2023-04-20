import { Component } from 'solid-js';

import { Photo } from '../../models/api/Photo';
import { ThumbnailSizeIdType, getThumbnailClass } from '../../models/ThumbnailSize';

export type Props = {
    photo: Photo,
    thumbnailSize: ThumbnailSizeIdType
}

const PhotoGridItem: Component<Props> = (props) => {
    return (
        <img
            class="block rounded-1"
            classList={getThumbnailClass(props.thumbnailSize)}
            src={props.photo.imageXsSq.url} />
    );
};

export default PhotoGridItem;
