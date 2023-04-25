import { Component } from 'solid-js';

import { Photo } from '../../models/api/Photo';
import { ThumbnailSizeIdType, getThumbnailClass } from '../../models/ThumbnailSize';
import { A } from '@solidjs/router';

export type Props = {
    photo: Photo,
    thumbnailSize: ThumbnailSizeIdType
}

const PhotoGridItem: Component<Props> = (props) => {
    return (
        <A href={`/categories/photos/${props.photo.categoryId}/grid/${props.photo.id}`}>
            <img
                class="block rounded-1 saturate-40 hover:saturate-100 border-1 border-transparent hover:border-primary"
                classList={getThumbnailClass(props.thumbnailSize)}
                src={props.photo.imageXsSq.url} />
        </A>
    );
};

export default PhotoGridItem;
