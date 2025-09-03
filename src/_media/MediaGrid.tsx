import { Component, For } from "solid-js";

import { Media } from "../_models/Media";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";
import { ThumbnailSizeIdType } from "../_models/ThumbnailSize";

import MediaLink from "./MediaLink";

type Props = {
    items: Media[];
    thumbnailSize: ThumbnailSizeIdType;
    activeRoute: AppRouteDefinition;
};

const MediaGrid: Component<Props> = props => {
    return (
        <div class="flex gap-2 flex-wrap place-content-center mb-4">
            <For each={props.items}>
                {(media, idx) => (
                    <MediaLink
                        media={media}
                        rounded={true}
                        isActiveItem={false} // no need to show highlight state in grid view
                        route={props.activeRoute}
                        thumbnailSize={props.thumbnailSize}
                        eager={idx() <= EAGER_THRESHOLD}
                    />
                )}
            </For>
        </div>
    );
};

export default MediaGrid;
