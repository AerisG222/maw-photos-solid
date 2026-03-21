import { Component, For, Show } from "solid-js";
import { A } from "@solidjs/router";

import { getThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";
import { getCategoryPath } from "../../categories/_routes";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";

import FavoriteIcon from "../icon/FavoriteIcon";
import MediaTypeIcon from '../icon/MediaTypeIcon';
import IconButton from '../icon/IconButton';

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
    const onClickFavorite = () => {
        if (props.setIsFavorite) {
            props.setIsFavorite(props.category, !props.category.isFavorite);
        }
    };

    return (
        <A
            href={getCategoryPath(props.category.year, props.category.slug)}
            class="grid group border-1 rounded-sm bg-base-200 border-secondary/20 cursor-pointer hover:bg-base-300 hover:border-primary hover:text-primary"
        >
            <Show when={props.showYears}>
                <div class="text-center max-w-[160px]">
                    {props.category.effectiveDate.getFullYear()}
                </div>
            </Show>

            <div class="inline-grid grid-cols-2 grid-rows-2" style={{
                "width": `${getThumbnailSize(props.thumbnailSize).width}px`,
                "height": `${getThumbnailSize(props.thumbnailSize).height}px`
            }}>
                <img
                    src={getMediaTeaserUrl(props.category.teaser, props.thumbnailSize)}
                    classList={{
                        "col-span-full": true,
                        "row-span-full": true,
                        "block": true,
                        "w-full": true,
                        "saturate-50": props.dimThumbnails,
                        "group-hover:saturate-100": props.dimThumbnails,
                        "rounded-t-sm": !props.showYears,
                        "rounded-b-sm": !props.showTitles
                    }}
                    loading={props.eager ? "eager" : "lazy"}
                />

                <Show when={props.showTypesBadge}>
                    <div class="col-start-1 row-start-1 z-10 justify-self-start self-start badge m-[1px] gap-0.5 px-0.5 opacity-50">
                        <For each={props.category.mediaTypes}>
                            { typ => (
                                <MediaTypeIcon extraClasses={"text-sm text-primary"} mediaType={typ} />
                            )}
                        </For>
                    </div>
                </Show>

                <Show when={props.showFavoriteBadge}>
                    <div class="col-start-2 row-start-1 z-10 justify-self-end self-start">
                        <IconButton buttonClasses={"btn-xs text-primary opacity-50 hover:opacity-100 m-[1px]"} onClick={onClickFavorite}>
                            <FavoriteIcon isFavorite={props.category.isFavorite} />
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
