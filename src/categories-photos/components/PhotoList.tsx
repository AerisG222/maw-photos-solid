import { Component, For } from 'solid-js';
import { A } from '@solidjs/router';

import { usePhotoListContext } from '../../contexts/PhotoListContext';
import { ThumbnailSizeIdType, getThumbnailClass } from '../../models/ThumbnailSize';
import { categoriesPhotosDetail, getPhotoCategoryRoutePath } from '../_routes';

export type Props = {
    thumbnailSize: ThumbnailSizeIdType;
}

const PhotoList: Component<Props> = (props) => {
    const [photos] = usePhotoListContext();

    return (
        <div class="flex flex-nowrap overflow-x-auto">
            <For each={photos.photos}>{photo =>
                <A href={getPhotoCategoryRoutePath(categoriesPhotosDetail, photo.categoryId, photo.id)} class="cursor-pointer mr-[0.1rem] saturate-40 hover:saturate-100 border-1 border-transparent hover:border-primary">
                    <img src={photo.imageXsSq.url} class="max-w-none" classList={getThumbnailClass(props.thumbnailSize)} />
                </A>
            }</For>
        </div>
    );
}

export default PhotoList;
