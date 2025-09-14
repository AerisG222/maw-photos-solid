import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { Media } from "../_models/Media";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { getThumbnailSize, ThumbnailSizeIdType } from "../_models/ThumbnailSize";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";

import FavoriteIcon from "../_components/icon/FavoriteIcon";
import FloatingIconButton from "../_components/icon/FloatingIconButton";

interface Props {
    href: string;
    media: Media;
    thumbnailSize: ThumbnailSizeIdType;
    dimThumbnails: boolean;
    showFavoritesBadge: boolean;
    rounded: boolean;
    isActiveItem: boolean;
    route: AppRouteDefinition;
    eager: boolean;
    scroll?: (el: HTMLAnchorElement, media: Media) => void;
    setIsFavorite: (media: Media, isFavorite: boolean) => void;
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
            href={props.href}
            ref={el => (props.scroll ? props.scroll(el, props.media) : {})}
        >
            <Show when={props.showFavoritesBadge}>
                <FloatingIconButton onClick={onClickFavorite}>
                    <FavoriteIcon isFavorite={props.media.isFavorite} />
                </FloatingIconButton>
            </Show>

            <img
                src={getMediaTeaserUrl(props.media, props.thumbnailSize)}
                width={getThumbnailSize(props.thumbnailSize).width}
                height={getThumbnailSize(props.thumbnailSize).height}
                classList={{
                    "max-w-none": true,
                    "rounded-md": props.rounded
                }}
                loading={props.eager ? "eager" : "lazy"}
            />
        </A>
    );
};

export default MediaLink;
