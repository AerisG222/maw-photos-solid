import { Component, Match, Show, Switch } from 'solid-js';

import { Media, MediaTypePhoto, MediaTypeVideo, Photo, Video } from '../_models/Media';
import { useVisualEffectsContext } from './contexts/VisualEffectsContext';

import MainPhoto from './photos/MainPhoto';
import MainVideo from './videos/MainVideo';

type Props = {
    media: Media;
    maxHeightStyle?: string;
}

const MediaMainItem: Component<Props> = (props) => {
    const [, { getFilterStyles, getTransformStyles }] = useVisualEffectsContext();

    return (
        <Show when={props.media}>
            <div
                class="h-100% w-100% max-h-100vh max-w-100% object-contain self-center"
                style={`${props.maxHeightStyle ?? ''} ${getTransformStyles()} ${getFilterStyles()}`}>
                <Switch>
                    <Match when={props.media.kind === MediaTypePhoto}>
                        <MainPhoto photo={props.media as Photo} />
                    </Match>
                    <Match when={props.media.kind === MediaTypeVideo}>
                        <MainVideo video={props.media as Video} videoSize={'large'} />
                    </Match>
                </Switch>
            </div>
        </Show>
    );
};

export default MediaMainItem;
