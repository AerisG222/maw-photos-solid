import { Component, For, Match, Switch, createEffect, createSignal } from "solid-js";

import { useMediaListContext } from "./contexts/MediaListContext";
import { ThumbnailSizeIdType } from "../_models/ThumbnailSize";
import { Media } from "../_models/Media";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import MediaLink from "./MediaLink";

type Props = {
    thumbnailSize: ThumbnailSizeIdType;
    activeRoute?: AppRouteDefinition;
};

const MediaList: Component<Props> = props => {
    const [scrollElement, setScrollElement] = createSignal(undefined);
    const [mediaList] = useMediaListContext();

    const scroll = (el: HTMLAnchorElement, media: Media) => {
        if (mediaList.activeItem?.id === media.id) {
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

            parent.scrollTo({ top: 0, left: newLeft, behavior: "smooth" });
        }
    });

    return (
        <div class="flex flex-nowrap overflow-x-auto scrollable">
            <For each={mediaList.items}>
                {(media, idx) => (
                    <MediaLink
                        media={media}
                        rounded={false}
                        thumbnailSize={props.thumbnailSize}
                        isActiveItem={mediaList.activeItem?.id === media.id}
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
