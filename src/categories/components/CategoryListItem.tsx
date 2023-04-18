import { Component } from 'solid-js';
import { A } from '@solidjs/router';

import { allThumbnailSizes, ThumbnailSizeIdType } from '../../models/ThumbnailSize';
import { equalsIgnoreCase } from '../../models/Utils';
import { ICategory } from '../../models/Category';
import { getCategoryTypeIcon } from '../../models/CategoryTypeFilter';

export type Props = {
    category: ICategory,
    thumbnailSize: ThumbnailSizeIdType
}

const CategoryListItem: Component<Props> = (props) => {
    const thumbnailClass = () => allThumbnailSizes
        .filter(x => equalsIgnoreCase(x.id, props.thumbnailSize))
        .map(x => x.klass)[0];

    const categoryTypeThumbnail = () => getCategoryTypeIcon(props.category.type);

    return (
        <A href={props.category.route}
            class="group block cursor-pointer p-1 bg-secondary-content:6 border-b-1 border-b-secondary-content:10% hover:bg-secondary-content:20 hover:color-primary">
            <span class="m-x-4 text-6" classList={categoryTypeThumbnail()} />
            <img src={props.category.teaserImageSq.url} classList={thumbnailClass()} class="inline saturate-50 group-hover:saturate-100" />
            <span class="m-l-4">{props.category.name}</span>
        </A>
    );
}

export default CategoryListItem;
