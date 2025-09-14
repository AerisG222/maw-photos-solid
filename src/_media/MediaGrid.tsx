import { Component, For } from "solid-js";

import { Media } from "../_models/Media";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";
import { ThumbnailSizeIdType } from "../_models/ThumbnailSize";

import MediaLink from "./MediaLink";

interface Props {
    mediaLinkBuilder: (media: Media) => string;
    items: Media[];
    thumbnailSize: ThumbnailSizeIdType;
    dimThumbnails: boolean;
    showFavoritesBadge: boolean;
    activeRoute: AppRouteDefinition;
    setIsFavorite: (media: Media, isFavorite: boolean) => void;
}

const MediaGrid: Component<Props> = props => {
    return (
        <div class="flex gap-2 flex-wrap place-content-center mb-4">
            <For each={props.items}>
                {(media, idx) => (
                    <MediaLink
                        href={props.mediaLinkBuilder(media)}
                        media={media}
                        rounded={true}
                        isActiveItem={false} // no need to show highlight state in grid view
                        route={props.activeRoute}
                        thumbnailSize={props.thumbnailSize}
                        dimThumbnails={props.dimThumbnails}
                        showFavoritesBadge={props.showFavoritesBadge}
                        eager={idx() <= EAGER_THRESHOLD}
                        setIsFavorite={props.setIsFavorite}
                    />
                )}
            </For>
        </div>
    );
};

export default MediaGrid;
