import { Component, Show } from 'solid-js';
import { A } from '@solidjs/router';

import { getThumbnailClass, ThumbnailSizeIdType } from '../../models/ThumbnailSize';
import { ICategory } from '../../models/Category';

export type Props = {
    category: ICategory,
    showTitles: boolean,
    thumbnailSize: ThumbnailSizeIdType
}

const CategoryCard: Component<Props> = (props) => {
    return(
        <A href={props.category.route}
            class="group bg-secondary-content:6 border-1 rounded-1 border-primaryContent-[10%] cursor-pointer hover:border-primary hover:color-primary">
            <img
                src={props.category.teaserImageSq.url}
                class="rounded-t-1 saturate-50 group-hover:saturate-100"
                classList={getThumbnailClass(props.thumbnailSize)} />
            <Show when={props.showTitles}>
                <div class="text-center pb-1 max-w-[160px]">{props.category.name}</div>
            </Show>
        </A>
    );
}

export default CategoryCard;
