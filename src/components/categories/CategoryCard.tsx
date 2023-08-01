import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { getThumbnailClass, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";

type Props = {
    category: Category;
    showTitles: boolean;
    showYears: boolean;
    thumbnailSize: ThumbnailSizeIdType;
};

const CategoryCard: Component<Props> = (props) => {
    return(
        <A href={props.category.route}
            class="group border-1 rounded-1 bg-base-200 border-secondary:20% cursor-pointer hover:bg-base-300 hover:border-primary hover:color-primary">
            <Show when={props.showYears}>
                <div class="text-center max-w-[160px]">{props.category.year}</div>
            </Show>

            <img
                src={props.category.teaserImageUrl}
                class="rounded-t-1 saturate-50 group-hover:saturate-100"
                classList={getThumbnailClass(props.thumbnailSize)}
                loading="lazy" />

            <Show when={props.showTitles}>
                <div class="text-center max-w-[160px]">{props.category.name}</div>
            </Show>
        </A>
    );
};

export default CategoryCard;
