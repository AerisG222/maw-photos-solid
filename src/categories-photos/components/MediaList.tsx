import { Component, For } from 'solid-js';

import { useMediaListContext } from '../../contexts/MediaListContext';
import { ThumbnailSizeIdType } from '../../models/ThumbnailSize';
import { Media } from '../../models/Media';
import { categoriesPhotosDetail } from '../_routes';

import PhotoLink from './PhotoLink';

export type Props = {
    thumbnailSize: ThumbnailSizeIdType;
}

const MediaList: Component<Props> = (props) => {
    const [mediaList] = useMediaListContext();

    const getListItem = (media: Media) => {
        switch (media.kind) {
            case 'photo':
                return <PhotoLink
                    photo={media}
                    rounded={false}
                    thumbnailSize={props.thumbnailSize}
                    isActiveItem={mediaList.activeItem?.id === media.id}
                    route={categoriesPhotosDetail}
                    media={media}
                    scroll={scroll} />;
            case 'video':
                return <div>video</div>
            default:
                // eslint-disable-next-line no-case-declarations
                const _exhaustiveCheck: never = media;
                return _exhaustiveCheck;
        }
    }

    const scroll = (el: HTMLAnchorElement, media: Media) => {
        if(mediaList.activeItem?.id === media.id) {
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
            <For each={mediaList.items}>{media =>
                getListItem(media)
            }</For>
        </div>
    );
}

export default MediaList;
