import { Component, Show } from 'solid-js';

import { allThumbnailSizes, ThumbnailSizeIdType } from '../../models/ThumbnailSize';
import { equalsIgnoreCase } from '../../models/Utils';
import { ICategory } from '../../models/Category';

export type Props = {
    category: ICategory,
    showTitles: boolean,
    thumbnailSize: ThumbnailSizeIdType
}

const CategoryCard: Component<Props> = (props) => {
    const thumbnailClass = () => allThumbnailSizes
        .filter(x => equalsIgnoreCase(x.id, props.thumbnailSize))
        .map(x => x.klass)[0];

    return(
        <div class="bg-secondary-content:6 border-1 rounded-1 border-primaryContent-[10%]">
            <img src={props.category.teaserImageSq.url} class="rounded-t-1" classList={thumbnailClass()} />
            <Show when={props.showTitles}>
                <div class="text-center pb-1 max-w-[160px]">{props.category.name}</div>
            </Show>
        </div>
    );
}

export default CategoryCard;
