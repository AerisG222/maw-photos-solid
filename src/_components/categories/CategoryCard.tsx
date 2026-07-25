import { Component, For, Show, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";

import { getThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";
import { getCategoryPath } from "../../categories/_routes";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";
import { hasRevealed, markRevealed } from "../loading/_imageReveal";

import FavoriteIcon from "../icon/FavoriteIcon";
import MediaTypeIcon from "../icon/MediaTypeIcon";
import IconButton from "../icon/IconButton";

interface Props {
    category: Category;
    showTitles: boolean;
    showYears: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    dimThumbnails: boolean;
    showFavoriteBadge: boolean;
    showTypesBadge: boolean;
    eager: boolean;
    setIsFavorite: (category: Category, isFavorite: boolean) => void;
}

const CategoryCard: Component<Props> = props => {
    const teaserUrl = () => getMediaTeaserUrl(props.category.teaser, props.thumbnailSize);

    // teasers arrive lazily; fading each one in keeps a long scroll from
    // reading as a stuttering checkerboard of hard pop-ins. A teaser already
    // seen this session starts visible - see _imageReveal for why that matters.
    const [teaserLoaded, setTeaserLoaded] = createSignal(hasRevealed(teaserUrl()));

    let img!: HTMLImageElement;

    const reveal = () => {
        markRevealed(teaserUrl());
        setTeaserLoaded(true);
    };

    // onMount runs after src is applied and the element is attached, so a
    // cached teaser whose load event we missed is still revealed
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
            class="grid group border-1 rounded-sm bg-base-200 border-secondary/20 cursor-pointer
                hover:bg-base-300 hover:border-primary hover:text-primary
                hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20
                transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out"
        >
            <Show when={props.showYears}>
                <div class="text-center max-w-[160px]">
                    {props.category.effectiveDate.getFullYear()}
                </div>
            </Show>

            {/* overflow-hidden keeps the teaser clipped to the card's rounded corners */}
            <div
                classList={{
                    "inline-grid": true,
                    "grid-cols-2": true,
                    "grid-rows-2": true,
                    "overflow-hidden": true,
                    "rounded-t-sm": !props.showYears,
                    "rounded-b-sm": !props.showTitles
                }}
                style={{
                    width: `${getThumbnailSize(props.thumbnailSize).width}px`,
                    height: `${getThumbnailSize(props.thumbnailSize).height}px`
                }}
            >
                <img
                    ref={img}
                    src={teaserUrl()}
                    classList={{
                        "col-span-full": true,
                        "row-span-full": true,
                        block: true,
                        "w-full": true,
                        "saturate-50": props.dimThumbnails,
                        "group-hover:saturate-100": props.dimThumbnails,
                        "rounded-t-sm": !props.showYears,
                        "rounded-b-sm": !props.showTitles,
                        // no hover zoom here: the teaser is served at exactly the
                        // rendered size, so scaling it up resamples a source with
                        // no spare pixels and the browser interpolates the
                        // composited layer while the transform runs - it reads as
                        // a blur that sharpens once the transition settles
                        "transition-[filter,opacity]": true,
                        "duration-[400ms]": true,
                        "ease-out": true,
                        "opacity-0": !teaserLoaded(),
                        "opacity-100": teaserLoaded()
                    }}
                    loading={props.eager ? "eager" : "lazy"}
                    onLoad={reveal}
                    // never leave a failed load as an invisible gap
                    onError={reveal}
                />

                <Show when={props.showTypesBadge}>
                    <div class="col-start-1 row-start-1 z-10 justify-self-start self-start badge m-[1px] gap-0.5 px-0.5 opacity-50">
                        <For each={props.category.mediaTypes}>
                            {typ => (
                                <MediaTypeIcon
                                    extraClasses={"text-sm text-primary"}
                                    mediaType={typ}
                                />
                            )}
                        </For>
                    </div>
                </Show>

                <Show when={props.showFavoriteBadge}>
                    <div class="col-start-2 row-start-1 z-10 justify-self-end self-start">
                        <IconButton
                            buttonClasses={
                                "btn-xs text-primary opacity-50 hover:opacity-100 m-[1px]"
                            }
                            onClick={onClickFavorite}
                        >
                            <FavoriteIcon
                                isFavorite={props.category.isFavorite}
                                subjectId={props.category.id}
                            />
                        </IconButton>
                    </div>
                </Show>
            </div>

            <Show when={props.showTitles}>
                <div class="text-center max-w-[160px]">{props.category.name}</div>
            </Show>
        </A>
    );
};

export default CategoryCard;
