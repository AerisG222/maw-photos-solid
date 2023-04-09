import { Component, Show } from 'solid-js';

import { PhotoCategory } from '../../models/api/PhotoCategory';

export type Props = {
    category: PhotoCategory,
    showTitles: boolean
}

const CategoryCard: Component<Props> = (props) => {
    return(
        <div>
            <img src={props.category.teaserImageSq.url} width="160" height="120" />
            <Show when={props.showTitles}>
                <div class="text-center">{props.category.name}</div>
            </Show>
        </div>
    );
}

export default CategoryCard;
