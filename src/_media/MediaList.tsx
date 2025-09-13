import { Component, For, createEffect, onCleanup } from "solid-js";

import { ThumbnailSizeIdType } from "../_models/ThumbnailSize";
import { Media } from "../_models/Media";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";
import { Uuid } from "../_models/Uuid";

import MediaLink from "./MediaLink";

interface Props {
    mediaLinkBuilder: (media: Media) => string;
    media: Media[];
    activeMedia: Media;
    thumbnailSize: ThumbnailSizeIdType;
    dimThumbnails: boolean;
    activeRoute?: AppRouteDefinition;
}

const MediaList: Component<Props> = props => {
    const elMap = new Map<Uuid, HTMLAnchorElement>();

    const scroll = (el: HTMLAnchorElement, media: Media) => {
        elMap.set(media.id, el);
    };

    createEffect(() => {
        const el = elMap.get(props.activeMedia.id);
        const parent = el?.parentElement;

        if (parent) {
            const startingOffset = parent.firstChild.offsetLeft;
            const parentMiddle = parent.clientWidth / 2;
            const imgMiddle = el.clientWidth / 2;
            const newLeft = Math.max(0, el.offsetLeft - startingOffset - parentMiddle + imgMiddle);

            parent.scrollTo({ top: 0, left: newLeft, behavior: "smooth" });
        }
    });

    onCleanup(() => {
        elMap.clear();
    });

    return (
        <div class="flex flex-nowrap overflow-x-auto scrollable">
            <For each={props.media}>
                {(media, idx) => (
                    <MediaLink
                        href={props.mediaLinkBuilder(media)}
                        media={media}
                        rounded={false}
                        thumbnailSize={props.thumbnailSize}
                        dimThumbnails={props.dimThumbnails}
                        isActiveItem={props.activeMedia.id === media.id}
                        route={props.activeRoute!}
                        scroll={scroll}
                        eager={idx() <= EAGER_THRESHOLD}
                    />
                )}
            </For>
        </div>
    );
};

export default MediaList;
