import { Component, For, Match, Switch, createEffect, createSignal } from "solid-js";

import { useMediaListContext } from "./contexts/MediaListContext";
import { ThumbnailSizeIdType } from "../_models/ThumbnailSize";
import { Media, MediaTypePhoto, MediaTypeVideo, Photo, Video } from "../_models/Media";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { EAGER_THRESHOLD } from '../_models/utils/Constants';

import PhotoLink from "./photos/PhotoLink";
import VideoLink from "./videos/VideoLink";

type Props = {
    thumbnailSize: ThumbnailSizeIdType;
    activeRoute?: AppRouteDefinition;
};

const MediaList: Component<Props> = (props) => {
    const [scrollElement, setScrollElement] = createSignal(undefined);
    const [mediaList] = useMediaListContext();

    const scroll = (el: HTMLAnchorElement, media: Media) => {
        if(mediaList.activeItem?.id === media.id) {
            setScrollElement(el);
        }
    };

    createEffect(() => {
        const el = scrollElement();

        const parent = el?.parentElement;

        if (parent) {
            const startingOffset = parent.firstChild.offsetLeft;
            const parentMiddle = parent.clientWidth / 2;
            const imgMiddle = el.clientWidth / 2;
            const newLeft = Math.max(
                0,
                el.offsetLeft - startingOffset - parentMiddle + imgMiddle
            );

            parent.scrollTo({ top: 0, left: newLeft, behavior: "smooth" });
        }
    });

    return (
        <div class="flex flex-nowrap overflow-x-auto scrollable">
            <For each={mediaList.items}>{ (media, idx) =>
                <Switch>
                    <Match when={media.kind === MediaTypePhoto}>
                        <PhotoLink
                            photo={media as Photo}
                            rounded={false}
                            thumbnailSize={props.thumbnailSize}
                            isActiveItem={mediaList.activeItem?.id === media.id}
                            route={props.activeRoute}
                            scroll={scroll}
                            eager={idx() <= EAGER_THRESHOLD} />
                    </Match>
                    <Match when={media.kind === MediaTypeVideo}>
                        <VideoLink
                            video={media as Video}
                            rounded={false}
                            thumbnailSize={props.thumbnailSize}
                            isActiveItem={mediaList.activeItem?.id === media.id}
                            route={props.activeRoute}
                            scroll={scroll}
                            eager={idx() <= EAGER_THRESHOLD} />
                    </Match>
                </Switch>
            }</For>
        </div>
    );
};

export default MediaList;
