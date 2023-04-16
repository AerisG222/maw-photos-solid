import { Component } from 'solid-js';

import { allThumbnailSizes, ThumbnailSizeIdType } from '../../models/ThumbnailSize';
import { equalsIgnoreCase } from '../../models/Utils';
import { ICategory } from '../../models/Category';

export type Props = {
    category: ICategory,
    thumbnailSize: ThumbnailSizeIdType
}

const CategoryListItem: Component<Props> = (props) => {
    const thumbnailClass = () => allThumbnailSizes
        .filter(x => equalsIgnoreCase(x.id, props.thumbnailSize))
        .map(x => x.klass)[0];

    return(
        <div class="bg-secondary-content:6 border-b-1 border-b-secondary-content:10% p-1">
            <img src={props.category.teaserImageSq.url} classList={thumbnailClass()} class="inline" />
            <span class="m-l-4">{props.category.name}</span>
        </div>
    );
}

export default CategoryListItem;
