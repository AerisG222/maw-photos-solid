import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { getThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";
import { getCategoryPath } from "../../categories/_routes";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";

import FavoriteIcon from "../icon/FavoriteIcon";
import FloatingIconButton from "../icon/FloatingIconButton";

interface Props {
    category: Category;
    showTitles: boolean;
    showYears: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    dimThumbnails: boolean;
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
            href={getCategoryPath(props.category.id)}
            class="group border-1 rounded-sm bg-base-200 border-secondary/20 cursor-pointer hover:bg-base-300 hover:border-primary hover:text-primary"
        >
            <Show when={props.showYears}>
                <div class="text-center max-w-[160px]">
                    {props.category.effectiveDate.getFullYear()}
                </div>
            </Show>

            <FloatingIconButton onClick={onClickFavorite}>
                <FavoriteIcon isFavorite={props.category.isFavorite} />
            </FloatingIconButton>

            <img
                src={getMediaTeaserUrl(props.category.teaser, props.thumbnailSize)}
                classList={{
                    "saturate-50": props.dimThumbnails,
                    "group-hover:saturate-100": props.dimThumbnails,
                    "rounded-t-sm": !props.showYears,
                    "rounded-b-sm": !props.showTitles
                }}
                width={getThumbnailSize(props.thumbnailSize).width}
                height={getThumbnailSize(props.thumbnailSize).height}
                loading={props.eager ? "eager" : "lazy"}
            />

            <Show when={props.showTitles}>
                <div class="text-center max-w-[160px]">{props.category.name}</div>
            </Show>
        </A>
    );
};

export default CategoryCard;
