import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { Media } from "../_models/Media";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { getThumbnailSize, ThumbnailSizeIdType } from "../_models/ThumbnailSize";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { createImageReveal } from "../_components/loading/_imageReveal";

import MediaTypeIcon from "../_components/icon/MediaTypeIcon";
import FavoriteBadge from "../_components/listing/FavoriteBadge";

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
    elevate?: boolean;
    scroll?: (el: HTMLAnchorElement, media: Media) => void;
    setIsFavorite?: (media: Media, isFavorite: boolean) => void;
}

const MediaLink: Component<Props> = props => {
    const thumbUrl = () => getMediaTeaserUrl(props.media, props.thumbnailSize);
    const { loaded: thumbLoaded, reveal, ref: imgRef } = createImageReveal(thumbUrl);

    const onClickFavorite = () => {
        if (props.setIsFavorite) {
            props.setIsFavorite(props.media, !props.media.isFavorite);
        }
    };

    return (
        <A
            classList={{
                group: true,
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
                "border-primary!": props.isActiveItem,
                // frames the zoom on hover
                "overflow-hidden": true,
                "transition-[transform,box-shadow,border-color,filter]": true,
                "duration-200": true,
                "ease-out": true,
                "hover:-translate-y-0.5": !!props.elevate,
                "hover:shadow-lg": !!props.elevate,
                "hover:shadow-primary/20": !!props.elevate
            }}
            style={{
                width: `${getThumbnailSize(props.thumbnailSize).width}px`,
                height: `${getThumbnailSize(props.thumbnailSize).height}px`
            }}
            href={props.href}
            ref={el => (props.scroll ? props.scroll(el, props.media) : {})}
        >
            <img
                ref={imgRef}
                src={thumbUrl()}
                classList={{
                    "col-span-full": true,
                    "row-span-full": true,
                    block: true,
                    "w-full": true,
                    "max-w-none": true,
                    "rounded-md": props.rounded,
                    // no hover zoom - see the note in CategoryCard
                    "transition-opacity": true,
                    "duration-[400ms]": true,
                    "ease-out": true,
                    "opacity-0": !thumbLoaded(),
                    "opacity-100": thumbLoaded()
                }}
                loading={props.eager ? "eager" : "lazy"}
                onLoad={reveal}
                onError={reveal}
            />

            <Show when={props.showTypesBadge}>
                <div class="col-start-1 row-start-1 z-10 justify-self-start self-start badge m-[1px] gap-0.5 px-0.5 opacity-50">
                    <MediaTypeIcon
                        extraClasses={"text-sm text-primary"}
                        mediaType={props.media.type}
                    />
                </div>
            </Show>

            <Show when={props.showFavoritesBadge}>
                <FavoriteBadge
                    isFavorite={props.media.isFavorite}
                    subjectId={props.media.id}
                    onToggle={onClickFavorite}
                />
            </Show>
        </A>
    );
};

export default MediaLink;
