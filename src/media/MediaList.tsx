import { Component, For } from 'solid-js';

import { useMediaListContext } from '../contexts/MediaListContext';
import { ThumbnailSizeIdType } from '../models/ThumbnailSize';
import { Media, MediaTypePhoto, MediaTypeVideo } from '../models/Media';
import { detailRoute } from './_routes';

import PhotoLink from '../components/photos/PhotoLink';
import VideoLink from '../components/videos/VideoLink';

type Props = {
    thumbnailSize: ThumbnailSizeIdType;
};

const MediaList: Component<Props> = (props) => {
    const [mediaList] = useMediaListContext();

    const getListItem = (media: Media) => {
        switch (media.kind) {
            case MediaTypePhoto:
                return <PhotoLink
                    photo={media}
                    rounded={false}
                    thumbnailSize={props.thumbnailSize}
                    isActiveItem={mediaList.activeItem?.id === media.id}
                    route={detailRoute}
                    scroll={scroll} />;
            case MediaTypeVideo:
                return <VideoLink
                    video={media}
                    rounded={false}
                    thumbnailSize={props.thumbnailSize}
                    isActiveItem={mediaList.activeItem?.id === media.id}
                    route={detailRoute}
                    scroll={scroll} />;
            default:
                // eslint-disable-next-line no-case-declarations
                const _exhaustiveCheck: never = media;
                return _exhaustiveCheck;
        }
    };

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
    };

    return (
        <div class="flex flex-nowrap overflow-x-auto">
            <For each={mediaList.items}>{media =>
                getListItem(media)
            }</For>
        </div>
    );
};

export default MediaList;
