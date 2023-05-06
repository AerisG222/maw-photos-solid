import { Component, For, JSXElement, createSignal } from 'solid-js';
import { A } from '@solidjs/router';

import { usePhotoListContext } from '../../contexts/PhotoListContext';
import { ThumbnailSizeIdType, getThumbnailClass } from '../../models/ThumbnailSize';
import { categoriesPhotosDetail, getPhotoCategoryRoutePath } from '../_routes';
import { Photo } from '../../models/api/Photo';

export type Props = {
    thumbnailSize: ThumbnailSizeIdType;
}

const PhotoList: Component<Props> = (props) => {
    const [photos] = usePhotoListContext();

    const getClassList = (photo: Photo) => {
        if(photos.activePhoto?.id === photo.id) {
            return {
                'saturate-100!': true,
                'border-primary!': true
            }
        }

        return {};
    }

    const scroll = (el: HTMLAnchorElement, photo: Photo) => {
        if(photos.activePhoto?.id === photo.id) {
            console.log(`activeid: ${photos.activePhoto.id} :: ${el.href}`);

            const parent = el.parentElement;

            if (parent) {
                const parentMiddle = parent.clientWidth / 2;
                const imgWidth = el.clientWidth / 2;
                const newLeft = Math.max(
                    0,
                    el.offsetLeft - imgWidth - parentMiddle
                );

                parent.scrollTo({ top: 0, left: newLeft, behavior: 'smooth' });
            }
        }
    }

    return (
        <div class="flex flex-nowrap overflow-x-auto">
            <For each={photos.photos}>{photo =>
                <A
                    href={getPhotoCategoryRoutePath(categoriesPhotosDetail, photo.categoryId, photo.id)}
                    class="cursor-pointer mr-[0.1rem] saturate-20 hover:saturate-100 border-1 border-transparent hover:border-primary"
                    classList={getClassList(photo)}
                    ref={el => scroll(el, photo)}>
                    <img src={photo.imageXsSq.url} class="max-w-none" classList={getThumbnailClass(props.thumbnailSize)} />
                </A>
            }</For>
        </div>
    );
}

export default PhotoList;
