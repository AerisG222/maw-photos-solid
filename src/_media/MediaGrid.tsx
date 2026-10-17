import { LinkOptions } from "@tanstack/solid-router";
import { Component } from "solid-js";

import { Media } from "../_models/Media";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import ListingSurface from "../_components/listing/ListingSurface";
import MediaLink from "./MediaLink";

interface Props {
    // a typed link to each photo, built by the media service
    mediaLinkBuilder: (media: Media) => LinkOptions;
    items: Media[];
    setIsFavorite: (media: Media, isFavorite: boolean) => void;
}

const MediaGrid: Component<Props> = props => {
    // entrance on the group, not each tile - see the note in YearGrid
    return (
        <ListingSurface animate class="mb-4" items={props.items}>
            {(media, index) => (
                <MediaLink
                    link={props.mediaLinkBuilder(media)}
                    media={media}
                    eager={index <= EAGER_THRESHOLD}
                    setIsFavorite={props.setIsFavorite}
                />
            )}
        </ListingSurface>
    );
};

export default MediaGrid;
