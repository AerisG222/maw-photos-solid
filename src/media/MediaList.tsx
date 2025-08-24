import { Component, For, createEffect, createSignal } from "solid-js";

import { ThumbnailSizeIdType } from "../_models/ThumbnailSize";
import { Media } from "../_models/Media";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import MediaLink from "./MediaLink";

type Props = {
    media: Media[];
    activeMedia: Media;
    thumbnailSize: ThumbnailSizeIdType;
    activeRoute?: AppRouteDefinition;
};

const MediaList: Component<Props> = props => {
    const [scrollElement, setScrollElement] = createSignal(undefined);

    const scroll = (el: HTMLAnchorElement, media: Media) => {
        if (props.activeMedia.id === media.id) {
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
            const newLeft = Math.max(0, el.offsetLeft - startingOffset - parentMiddle + imgMiddle);

            // TODO: list is being rebuilt, which causes each nav to scroll from zero...
            parent.scrollTo({ top: 0, left: newLeft /* behavior: "smooth" */ });
        }
    });

    return (
        <div class="flex flex-nowrap overflow-x-auto scrollable">
            <For each={props.media}>
                {(media, idx) => (
                    <MediaLink
                        media={media}
                        rounded={false}
                        thumbnailSize={props.thumbnailSize}
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
