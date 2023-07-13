import { Component, For } from 'solid-js';

import { Media, MediaTypePhoto, MediaTypeVideo } from '../models/Media';
import { categoriesPhotosGrid } from '../categories-photos/_routes';

import PhotoLink from '../components/photos/PhotoLink';
import VideoLink from '../components/videos/VideoLink';
import { categoriesVideosGrid } from '../categories-videos/_routes';

type Props = {
    items: Media[];
    thumbnailSize: string;
};

const MediaGrid: Component<Props> = (props) => {
    // we use the switch below rather than the Switch Component for a couple reasons:
    //   1. below can properly narrow type within the case (see: https://github.com/solidjs/solid/issues/199)
    //   2. remains reactive despite yellow squiggles
    //   3. ts will error if any new types are added in future
    const getGridItem = (media: Media) => {
        switch (media.kind) {
            case MediaTypePhoto:
                return <PhotoLink
                    photo={media}
                    rounded={true}
                    isActiveItem={false}  // no need to show highlight state in grid view
                    route={categoriesPhotosGrid}
                    thumbnailSize={props.thumbnailSize} />;
            case MediaTypeVideo:
                return <VideoLink
                    video={media}
                    rounded={true}
                    isActiveItem={false}  // no need to show highlight state in grid view
                    route={categoriesVideosGrid}
                    thumbnailSize={props.thumbnailSize} />;
            default:
                // eslint-disable-next-line no-case-declarations
                const _exhaustiveCheck: never = media;
                return _exhaustiveCheck;
        }
    };

    return (
        <div class="flex flex-gap-2 flex-wrap place-content-center mb-4">
            <For each={props.items}>{ media =>
                getGridItem(media)
            }</For>
        </div>
    );
};

export default MediaGrid;
