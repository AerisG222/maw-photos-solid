import { Component } from 'solid-js';
import { A } from '@solidjs/router';

import { getThumbnailClass, ThumbnailSizeIdType } from '../../models/ThumbnailSize';
import { Category } from '../../models/Category';
import { getCategoryTypeIcon } from '../../models/CategoryTypeFilter';
import { useCategoryContext } from '../../contexts/CategoryContext';

export type Props = {
    category: Category,
    thumbnailSize: ThumbnailSizeIdType
}

const CategoryListItem: Component<Props> = (props) => {
    const [category, {setActiveCategory}] = useCategoryContext();
    const categoryTypeThumbnail = () => getCategoryTypeIcon(props.category.type);

    return (
        <A href={props.category.route}
            onClick={evt => setActiveCategory(props.category)}
            class="group block cursor-pointer p-1 bg-secondary-content:6 border-b-1 border-b-secondary-content:10% hover:bg-secondary-content:20 hover:color-primary">
            <span class="m-x-4 text-6" classList={categoryTypeThumbnail()} />
            <img
                src={props.category.teaserImageUrl}
                classList={getThumbnailClass(props.thumbnailSize)}
                class="inline saturate-50 group-hover:saturate-100" />
            <span class="m-l-4">{props.category.name}</span>
        </A>
    );
}

export default CategoryListItem;
