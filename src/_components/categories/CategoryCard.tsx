import { Component, For, Show } from "solid-js";
import { A } from "@solidjs/router";

import { getThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";
import { getCategoryPath } from "../../categories/_routes";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";
import { createImageReveal } from "../loading/_imageReveal";

import MediaTypeIcon from "../icon/MediaTypeIcon";
import FavoriteBadge from "../listing/FavoriteBadge";

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
    const { loaded: teaserLoaded, reveal, ref: imgRef } = createImageReveal(teaserUrl);

    const onClickFavorite = () => {
        if (props.setIsFavorite) {
            props.setIsFavorite(props.category, !props.category.isFavorite);
        }
    };

    return (
        <A
            href={getCategoryPath(props.category.year, props.category.slug)}
            class="grid group border-1 rounded-sm bg-base-200 border-secondary/20 cursor-pointer
                hover:bg-base-300 hover:border-primary hover:text-primary elev-hover"
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
                    ref={imgRef}
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
                    <FavoriteBadge
                        isFavorite={props.category.isFavorite}
                        subjectId={props.category.id}
                        onToggle={onClickFavorite}
                    />
                </Show>
            </div>

            <Show when={props.showTitles}>
                <div class="text-center max-w-[160px]">{props.category.name}</div>
            </Show>
        </A>
    );
};

export default CategoryCard;
