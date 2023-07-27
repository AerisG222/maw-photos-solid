import { Component, For, Match, Switch } from 'solid-js';

import { Media, MediaTypePhoto, MediaTypeVideo, Photo, Video } from '../_models/Media';
import { categoryGridRoute } from './_routes';

import PhotoLink from './photos/PhotoLink';
import VideoLink from './videos/VideoLink';

type Props = {
    items: Media[];
    thumbnailSize: string;
};

const MediaGrid: Component<Props> = (props) => {
    return (
        <div class="flex flex-gap-2 flex-wrap place-content-center mb-4">
            <For each={props.items}>{ media =>
                <Switch>
                    <Match when={media.kind === MediaTypePhoto}>
                        <PhotoLink
                            photo={media as Photo}
                            rounded={true}
                            isActiveItem={false}  // no need to show highlight state in grid view
                            route={categoryGridRoute}
                            thumbnailSize={props.thumbnailSize} />
                    </Match>
                    <Match when={media.kind === MediaTypeVideo}>
                        <VideoLink
                            video={media as Video}
                            rounded={true}
                            isActiveItem={false}  // no need to show highlight state in grid view
                            route={categoryGridRoute}
                            thumbnailSize={props.thumbnailSize} />
                    </Match>
                </Switch>
            }</For>
        </div>
    );
};

export default MediaGrid;
