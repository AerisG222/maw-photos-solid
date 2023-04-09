import { Component } from 'solid-js';

import { PhotoCategory } from '../../models/api/PhotoCategory';

export type Props = {
    category: PhotoCategory
}

const CategoryCard: Component<Props> = (props) => {
    return(
        <div>
            <img src={props.category.teaserImageSq.url} width="160" height="120" />
        </div>
    );
}

export default CategoryCard;
