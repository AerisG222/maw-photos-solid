import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { Media } from "../_models/Media";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { getThumbnailSize, ThumbnailSizeIdType } from "../_models/ThumbnailSize";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";

import FavoriteIcon from "../_components/icon/FavoriteIcon";
import MediaTypeIcon from '../_components/icon/MediaTypeIcon';
import IconButton from '../_components/icon/IconButton';

interface Props {
    href: string;
    media: Media;
    thumbnailSize: ThumbnailSizeIdType;
    dimThumbnails: boolean;
    showFavoritesBadge: boolean;
    showTypesBadge: boolean;
    rounded: boolean;
    isActiveItem: boolean;
    route: AppRouteDefinition;
    eager: boolean;
    scroll?: (el: HTMLAnchorElement, media: Media) => void;
    setIsFavorite?: (media: Media, isFavorite: boolean) => void;
}

const MediaLink: Component<Props> = props => {
    const onClickFavorite = () => {
        if (props.setIsFavorite) {
            props.setIsFavorite(props.media, !props.media.isFavorite);
        }
    };

    return (
        <A
            classList={{
                "shrink-0": true,
                "inline-grid": true,
                "grid-cols-2": true,
                "grid-rows-2": true,
                "cursor-pointer": true,
                "mr-[0.1rem]": true,
                "saturate-50": props.dimThumbnails,
                "hover:saturate-100": props.dimThumbnails,
                "border-1": true,
                "border-transparent": true,
                "hover:border-primary": true,
                "rounded-md": props.rounded,
                "saturate-100!": props.isActiveItem,
                "border-primary!": props.isActiveItem
            }}
            style={{
                "width": `${getThumbnailSize(props.thumbnailSize).width}px`,
                "height": `${getThumbnailSize(props.thumbnailSize).height}px`
            }}
            href={props.href}
            ref={el => (props.scroll ? props.scroll(el, props.media) : {})}
        >
            <img
                src={getMediaTeaserUrl(props.media, props.thumbnailSize)}
                classList={{
                    "col-span-full": true,
                    "row-span-full": true,
                    "block": true,
                    "w-full": true,
                    "max-w-none": true,
                    "rounded-md": props.rounded
                }}
                loading={props.eager ? "eager" : "lazy"}
            />

            <Show when={props.showTypesBadge}>
                <div class="col-start-1 row-start-1 z-10 justify-self-start self-start badge m-[1px] gap-0.5 px-0.5 opacity-50">
                    <MediaTypeIcon extraClasses={"text-sm text-primary"} mediaType={props.media.type} />
                </div>
            </Show>

            <Show when={props.showFavoritesBadge}>
                <div class="col-start-2 row-start-1 z-10 justify-self-end self-start">
                    <IconButton buttonClasses={"btn-xs text-primary opacity-50 hover:opacity-100 m-[1px]"} onClick={onClickFavorite}>
                        <FavoriteIcon isFavorite={props.media.isFavorite} />
                    </IconButton>
                </div>
            </Show>
        </A>
    );
};

export default MediaLink;
