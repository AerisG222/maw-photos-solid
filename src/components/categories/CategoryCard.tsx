import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { getThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";

type Props = {
    category: Category;
    showTitles: boolean;
    showYears: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    eager: boolean;
};

const CategoryCard: Component<Props> = (props) => {
    return(
        <A href={props.category.route}
            class="group border-1 rounded-1 bg-base-200 border-secondary:20% cursor-pointer hover:bg-base-300 hover:border-primary hover:text-primary">
            <Show when={props.showYears}>
                <div class="text-center max-w-[160px]">{props.category.year}</div>
            </Show>

            <div class="relative">
                <Show when={props.category.type === 'videos'}>
                    <div class="z-10 absolute top-[1px] left-[1px] px-[3px] badge badge-sm bg-base-100:72 group-hover:text-primary">
                        <span class="icon-[ic--round-videocam]" />
                    </div>
                </Show>

                <img
                    src={props.category.teaserImageUrl}
                    class="saturate-50 group-hover:saturate-100"
                    classList={{
                        'rounded-t-1': !props.showYears,
                        'rounded-b-1': !props.showTitles
                    }}
                    width={getThumbnailSize(props.thumbnailSize).width}
                    height={getThumbnailSize(props.thumbnailSize).height}
                    loading={props.eager ? "eager" : "lazy"} />

                <Show when={props.showTitles}>
                    <div class="text-center max-w-[160px]">{props.category.name}</div>
                </Show>
            </div>

        </A>
    );
};

export default CategoryCard;
