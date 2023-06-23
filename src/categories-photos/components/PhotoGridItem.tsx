import { Component } from 'solid-js';

import { Photo } from '../../api/models/Photo';
import { ThumbnailSizeIdType, getThumbnailClass } from '../../models/ThumbnailSize';
import { A } from '@solidjs/router';
import { categoriesPhotosGrid, getPhotoCategoryRoutePath } from '../_routes';

export type Props = {
    photo: Photo,
    thumbnailSize: ThumbnailSizeIdType
}

const PhotoGridItem: Component<Props> = (props) => {
    return (
        <A href={getPhotoCategoryRoutePath(categoriesPhotosGrid, props.photo.categoryId, props.photo.id)}>
            <img
                class="block rounded-1 saturate-40 hover:saturate-100 border-1 border-transparent hover:border-primary"
                classList={getThumbnailClass(props.thumbnailSize)}
                src={props.photo.imageXsSq.url} />
        </A>
    );
};

export default PhotoGridItem;
