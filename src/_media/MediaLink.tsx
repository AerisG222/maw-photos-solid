import { Component, Show, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";

import { Media } from "../_models/Media";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { getThumbnailSize, ThumbnailSizeIdType } from "../_models/ThumbnailSize";
import { AppRouteDefinition } from "../_models/AppRouteDefinition";
import { hasRevealed, markRevealed } from "../_components/loading/_imageReveal";

import FavoriteIcon from "../_components/icon/FavoriteIcon";
import MediaTypeIcon from "../_components/icon/MediaTypeIcon";
import IconButton from "../_components/icon/IconButton";

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
    // grid usage lifts on hover; the detail-view filmstrip stays put so the
    // scroll-into-view math in MediaList is unaffected
    elevate?: boolean;
    scroll?: (el: HTMLAnchorElement, media: Media) => void;
    setIsFavorite?: (media: Media, isFavorite: boolean) => void;
}

const MediaLink: Component<Props> = props => {
    const thumbUrl = () => getMediaTeaserUrl(props.media, props.thumbnailSize);

    // a thumbnail already seen this session starts visible - see _imageReveal
    const [thumbLoaded, setThumbLoaded] = createSignal(hasRevealed(thumbUrl()));

    let img!: HTMLImageElement;

    const reveal = () => {
        markRevealed(thumbUrl());
        setThumbLoaded(true);
    };

    onMount(() => {
        if (img.complete) {
            reveal();
        }
    });

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
                ref={img}
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
                <div class="col-start-2 row-start-1 z-10 justify-self-end self-start">
                    <IconButton
                        buttonClasses={"btn-xs text-primary opacity-50 hover:opacity-100 m-[1px]"}
                        onClick={onClickFavorite}
                    >
                        <FavoriteIcon
                            isFavorite={props.media.isFavorite}
                            subjectId={props.media.id}
                        />
                    </IconButton>
                </div>
            </Show>
        </A>
    );
};

export default MediaLink;
