import { Component, For } from 'solid-js';
import { A } from '@solidjs/router';

import { usePhotoListContext } from '../../contexts/PhotoListContext';
import { ThumbnailSizeIdType, getThumbnailClass } from '../../models/ThumbnailSize';
import { categoriesPhotosDetail, getPhotoCategoryRoutePath } from '../_routes';
import { Photo } from '../../models/Photo';

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
            const parent = el.parentElement;

            if (parent) {
                const startingOffset = parent.firstChild.offsetLeft;
                const parentMiddle = parent.clientWidth / 2;
                const imgMiddle = el.clientWidth / 2;
                const newLeft = Math.max(
                    0,
                    el.offsetLeft - startingOffset - parentMiddle + imgMiddle
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
                    <img
                        src={photo.imageXsSqUrl}
                        class="max-w-none"
                        classList={getThumbnailClass(props.thumbnailSize)}
                        loading="lazy" />
                </A>
            }</For>
        </div>
    );
}

export default PhotoList;
