import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { getThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";
import { getCategoryPath } from "../../categories/_routes";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";

import FavoriteIcon from "../icon/FavoriteIcon";
import IconButton from "../icon/IconButton";

interface Props {
    category: Category;
    thumbnailSize: ThumbnailSizeIdType;
    dimThumbnails: boolean;
    eager: boolean;
    showYear?: boolean;
    setIsFavorite: (category: Category, isFavorite: boolean) => void;
}

const CategoryListItem: Component<Props> = props => {
    const onClickFavorite = () => {
        if (props.setIsFavorite) {
            props.setIsFavorite(props.category, !props.category.isFavorite);
        }
    };

    return (
        <A
            href={getCategoryPath(props.category.year, props.category.slug)}
            class="group flex items-center cursor-pointer p-1 bg-base-200 border-b-1 border-b-secondary/10 hover:bg-base-300 hover:text-primary"
        >
            <img
                src={getMediaTeaserUrl(props.category.teaser, props.thumbnailSize)}
                width={getThumbnailSize(props.thumbnailSize).width}
                height={getThumbnailSize(props.thumbnailSize).height}
                classList={{
                    inline: true,
                    "saturate-50": props.dimThumbnails,
                    "group-hover:saturate-100": props.dimThumbnails
                }}
                loading={props.eager ? "eager" : "lazy"}
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
                    extraClasses="hover:text-primary"
                />
            </IconButton>
        </A>
    );
};

export default CategoryListItem;
