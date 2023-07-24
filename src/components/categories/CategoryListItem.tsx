import { Component, Show } from 'solid-js';
import { A } from '@solidjs/router';

import { getThumbnailClass, ThumbnailSizeIdType } from '../../_models/ThumbnailSize';
import { Category } from '../../_models/Category';
import { useCategoryContext } from '../../contexts/CategoryContext';
import { categoryTypes } from '../../_models/CategoryTypes';

type Props = {
    category: Category;
    thumbnailSize: ThumbnailSizeIdType;
    showYear?: boolean;
};

const CategoryListItem: Component<Props> = (props) => {
    const [, {setActiveCategory}] = useCategoryContext();

    return (
        <A href={props.category.route}
            onClick={evt => setActiveCategory(props.category)}
            class="group block cursor-pointer p-1 bg-secondary-content:6 border-b-1 border-b-secondary-content:10% hover:bg-secondary-content:20 hover:color-primary">
            <span class={`m-x-4 text-6 ${categoryTypes[props.category.type].icon}`} />

            <img
                src={props.category.teaserImageUrl}
                classList={getThumbnailClass(props.thumbnailSize)}
                class="inline saturate-50 group-hover:saturate-100"
                loading="lazy" />

            <Show when={props.showYear}>
                <span class="m-l-4">{props.category.year}</span>
                <span class="m-l-4 text-6 i-ic-baseline-arrow-right"></span>
            </Show>

            <span class="m-l-4">{props.category.name}</span>
        </A>
    );
};

export default CategoryListItem;