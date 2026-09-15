import { Component } from "solid-js";

import { Media } from "../_models/Media";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";

import FavoriteBadge from "../_components/listing/FavoriteBadge";
import MediaTypeIcon from "../_components/icon/MediaTypeIcon";
import Tile from "../_components/listing/Tile";

interface Props {
    href: string;
    media: Media;
    eager: boolean;
    setIsFavorite?: (media: Media, isFavorite: boolean) => void;
}

/*
   One photograph in a grid. The chrome, the sizing and the fade are Tile's; what
   is left here is which picture, where it leads, and what belongs in its
   corners.
*/
const MediaLink: Component<Props> = props => {
    const onClickFavorite = () => props.setIsFavorite?.(props.media, !props.media.isFavorite);

    return (
        <Tile
            href={props.href}
            src={getMediaTeaserUrl(props.media)}
            eager={props.eager}
            badges={{
                topLeft: (
                    <div class="badge m-[1px] gap-0.5 px-0.5 opacity-50">
                        <MediaTypeIcon
                            extraClasses={"text-sm text-primary"}
                            mediaType={props.media.type}
                        />
                    </div>
                ),
                topRight: (
                    <FavoriteBadge
                        isFavorite={props.media.isFavorite}
                        subjectId={props.media.id}
                        onToggle={onClickFavorite}
                    />
                )
            }}
        />
    );
};

export default MediaLink;
