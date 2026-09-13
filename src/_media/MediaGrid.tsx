import { Component, For } from "solid-js";
import ListingSurface from "../_components/listing/ListingSurface";

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
    showTypesBadge: boolean;
    activeRoute: AppRouteDefinition;
    setIsFavorite: (media: Media, isFavorite: boolean) => void;
}

const MediaGrid: Component<Props> = props => {
    // entrance on the group, not each tile - see the note in YearGrid
    return (
        <ListingSurface animate class="mb-4">
            <For each={props.items}>
                {(media, idx) => (
                    <MediaLink
                        href={props.mediaLinkBuilder(media)}
                        media={media}
                        rounded={true}
                        elevate={true}
                        isActiveItem={false} // no need to show highlight state in grid view
                        route={props.activeRoute}
                        thumbnailSize={props.thumbnailSize}
                        dimThumbnails={props.dimThumbnails}
                        showFavoritesBadge={props.showFavoritesBadge}
                        showTypesBadge={props.showTypesBadge}
                        eager={idx() <= EAGER_THRESHOLD}
                        setIsFavorite={props.setIsFavorite}
                    />
                )}
            </For>
        </ListingSurface>
    );
};

export default MediaGrid;
