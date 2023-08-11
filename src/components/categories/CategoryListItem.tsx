import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { getThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";
import { categoryTypes } from "../../_models/CategoryTypes";

type Props = {
    category: Category;
    thumbnailSize: ThumbnailSizeIdType;
    eager: boolean;
    showYear?: boolean;
};

const CategoryListItem: Component<Props> = (props) => {
    return (
        <A href={props.category.route}
            class="group block cursor-pointer p-1 bg-base-200 border-b-1 border-b-secondary:10% hover:bg-secondary-content:20 hover:color-primary">
            <span class={`m-l-1 m-r-2 md:m-x-4 text-6 ${categoryTypes[props.category.type].icon}`} />

            <img
                src={props.category.teaserImageUrl}
                width={getThumbnailSize(props.thumbnailSize).width}
                height={getThumbnailSize(props.thumbnailSize).height}
                class="inline saturate-50 group-hover:saturate-100"
                loading={props.eager ? "eager" : "lazy"} />

            <Show when={props.showYear}>
                <span class="m-l-2 md:m-l-4">{props.category.year}</span>
                <span class="m-r-[-0.5rem] md:m-r-0 md:m-l-4 text-6 i-ic-baseline-arrow-right" />
            </Show>

            <span class="m-l-2 md:m-l-4">{props.category.name}</span>
        </A>
    );
};

export default CategoryListItem;
