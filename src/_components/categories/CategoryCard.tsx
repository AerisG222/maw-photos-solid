import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { getThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";
import { getCategoryPath } from "../../categories/_routes";

type Props = {
    category: Category;
    showTitles: boolean;
    showYears: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    eager: boolean;
};

const CategoryCard: Component<Props> = props => {
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

            <div class="relative">
                <img
                    src={props.category.teaser.files.find(f => f.scale === "qqvg-fill")!.path}
                    class="saturate-50 group-hover:saturate-100"
                    classList={{
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
            </div>
        </A>
    );
};

export default CategoryCard;
