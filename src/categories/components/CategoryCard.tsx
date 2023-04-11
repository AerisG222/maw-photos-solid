import { Component, Show } from 'solid-js';

import { PhotoCategory } from '../../models/api/PhotoCategory';
import { allThumbnailSizes, ThumbnailSizeIdType } from '../../models/ThumbnailSize';
import { equalsIgnoreCase } from '../../models/Utils';

export type Props = {
    category: PhotoCategory,
    showTitles: boolean,
    thumbnailSize: ThumbnailSizeIdType
}

const CategoryCard: Component<Props> = (props) => {
    const thumbnailClass = () => allThumbnailSizes
        .filter(x => equalsIgnoreCase(x.id, props.thumbnailSize))
        .map(x => x.klass)[0];

    return(
        <div class="bg-secondary-content:6 border-1 border-rounded border-primaryContent-[10%]">
            <img src={props.category.teaserImageSq.url} classList={thumbnailClass()} />
            <Show when={props.showTitles}>
                <div class="text-center">{props.category.name}</div>
            </Show>
        </div>
    );
}

export default CategoryCard;
