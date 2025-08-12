import { Component, For, Match, Switch } from "solid-js";

import { Media, MediaTypePhoto, MediaTypeVideo, Photo, Video } from "../_models/Media";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { EAGER_THRESHOLD } from '../_models/utils/Constants';

import PhotoLink from "./photos/PhotoLink";
import VideoLink from "./videos/VideoLink";

type Props = {
    items: Media[];
    thumbnailSize: string;
    activeRoute: AppRouteDefinition;
};

const MediaGrid: Component<Props> = (props) => {
    return (
        <div class="flex gap-2 flex-wrap place-content-center mb-4">
            <For each={props.items}>{ (media, idx) =>
                <Switch>
                    <Match when={media.kind === MediaTypePhoto}>
                        <PhotoLink
                            photo={media as Photo}
                            rounded={true}
                            isActiveItem={false}  // no need to show highlight state in grid view
                            route={props.activeRoute}
                            thumbnailSize={props.thumbnailSize}
                            eager={idx() <= EAGER_THRESHOLD} />
                    </Match>
                    <Match when={media.kind === MediaTypeVideo}>
                        <VideoLink
                            video={media as Video}
                            rounded={true}
                            isActiveItem={false}  // no need to show highlight state in grid view
                            route={props.activeRoute}
                            thumbnailSize={props.thumbnailSize}
                            eager={idx() <= EAGER_THRESHOLD} />
                    </Match>
                </Switch>
            }</For>
        </div>
    );
};

export default MediaGrid;
