import { Component, For } from "solid-js";

import { Media } from "../_models/Media";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import ListingSurface from "../_components/listing/ListingSurface";
import MediaLink from "./MediaLink";

interface Props {
    mediaLinkBuilder: (media: Media) => string;
    items: Media[];
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
                        eager={idx() <= EAGER_THRESHOLD}
                        setIsFavorite={props.setIsFavorite}
                    />
                )}
            </For>
        </ListingSurface>
    );
};

export default MediaGrid;
