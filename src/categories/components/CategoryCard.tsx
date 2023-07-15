import { Component, Show } from 'solid-js';
import { A } from '@solidjs/router';

import { getThumbnailClass, ThumbnailSizeIdType } from '../../_models/ThumbnailSize';
import { Category } from '../../_models/Category';
import { useCategoryContext } from '../../contexts/CategoryContext';

type Props = {
    category: Category;
    showTitles: boolean;
    thumbnailSize: ThumbnailSizeIdType;
};

const CategoryCard: Component<Props> = (props) => {
    const [category, {setActiveCategory}] = useCategoryContext();

    return(
        <A href={props.category.route}
            onClick={evt => setActiveCategory(props.category)}
            class="group bg-secondary-content:6 border-1 rounded-1 border-primaryContent-[10%] cursor-pointer hover:border-primary hover:color-primary">
            <img
                src={props.category.teaserImageUrl}
                class="rounded-t-1 saturate-50 group-hover:saturate-100"
                classList={getThumbnailClass(props.thumbnailSize)}
                loading="lazy" />
            <Show when={props.showTitles}>
                <div class="text-center pb-1 max-w-[160px]">{props.category.name}</div>
            </Show>
        </A>
    );
};

export default CategoryCard;
