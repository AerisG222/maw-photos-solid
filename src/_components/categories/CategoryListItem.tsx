import { Component, Show, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";

import { getThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";
import { MediaTypePhoto, MediaTypeVideo } from "../../_models/MediaType";
import { getCategoryPath } from "../../categories/_routes";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";

import { hasRevealed, markRevealed } from "../loading/_imageReveal";

import FavoriteIcon from "../icon/FavoriteIcon";
import IconButton from "../icon/IconButton";
import MediaTypeIcon from "../icon/MediaTypeIcon";

interface Props {
    category: Category;
    thumbnailSize: ThumbnailSizeIdType;
    dimThumbnails: boolean;
    eager: boolean;
    showYear?: boolean;
    setIsFavorite: (category: Category, isFavorite: boolean) => void;
}

const CategoryListItem: Component<Props> = props => {
    const teaserUrl = () => getMediaTeaserUrl(props.category.teaser, props.thumbnailSize);

    // a teaser already seen this session starts visible - see _imageReveal
    const [teaserLoaded, setTeaserLoaded] = createSignal(hasRevealed(teaserUrl()));

    let img!: HTMLImageElement;

    const reveal = () => {
        markRevealed(teaserUrl());
        setTeaserLoaded(true);
    };

    onMount(() => {
        if (img.complete) {
            reveal();
        }
    });

    const onClickFavorite = () => {
        if (props.setIsFavorite) {
            props.setIsFavorite(props.category, !props.category.isFavorite);
        }
    };

    return (
        <A
            href={getCategoryPath(props.category.year, props.category.slug)}
            class="group flex items-center cursor-pointer p-1 bg-base-200 border-b-1 border-b-secondary/10
                hover:bg-base-300 hover:text-primary
                transition-[background-color,color] duration-200 ease-out"
        >
            <img
                ref={img}
                src={teaserUrl()}
                width={getThumbnailSize(props.thumbnailSize).width}
                height={getThumbnailSize(props.thumbnailSize).height}
                classList={{
                    inline: true,
                    "saturate-50": props.dimThumbnails,
                    "group-hover:saturate-100": props.dimThumbnails,
                    "transition-[filter,opacity]": true,
                    "duration-[400ms]": true,
                    "ease-out": true,
                    "opacity-0": !teaserLoaded(),
                    "opacity-100": teaserLoaded()
                }}
                loading={props.eager ? "eager" : "lazy"}
                onLoad={reveal}
                onError={reveal}
            />

            <MediaTypeIcon
                extraClasses={`ml-2 text-lg text-primary ${props.category.mediaTypes.includes(MediaTypePhoto) ? "opacity-100" : "opacity-10"}`}
                mediaType={MediaTypePhoto}
            />
            <MediaTypeIcon
                extraClasses={`ml-1 text-lg text-primary ${props.category.mediaTypes.includes(MediaTypeVideo) ? "opacity-100" : "opacity-10"}`}
                mediaType={MediaTypeVideo}
            />

            <Show when={props.showYear}>
                <span class="ml-2 md:ml-4">{props.category.effectiveDate.getFullYear()}</span>
                <span class="mr-[-0.5rem] md:mr-0 md:ml-4 text-6 icon-[ic--baseline-arrow-right]" />
            </Show>

            <span class="ml-2 md:ml-4">{props.category.name}</span>

            <span class="grow" />

            <IconButton onClick={onClickFavorite} buttonClasses="btn-lg mr-4">
                <FavoriteIcon
                    isFavorite={props.category.isFavorite}
                    subjectId={props.category.id}
                    extraClasses="hover:text-primary"
                />
            </IconButton>
        </A>
    );
};

export default CategoryListItem;
