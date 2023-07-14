import { ParentComponent, children, createEffect, createResource } from 'solid-js';

import { getPhotos } from '../api/PhotoCategories';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useMediaListContext } from '../contexts/MediaListContext';
import { CategoryType } from '../models/CategoryType';
import { useParams } from '@solidjs/router';

// todo: props or url param?
type Props = {
    categoryId: number;
    id: number | undefined;
};

const PhotoLoader: ParentComponent<Props> = (props) => {
    const params = useParams();
    const [photosResource] = createResource(parseInt(params.categoryId, 10), getPhotos);
    const [, { setActiveCategoryById }] = useCategoryContext();
    const [items, { setItems, setActiveItem: setActivePhoto }] = useMediaListContext();

    const c = children(() => props.children);

    createEffect(() => {
        setActiveCategoryById(params.categoryType as CategoryType, props.categoryId);

        if(!photosResource.loading && !photosResource.error) {
            setItems(photosResource());
        } else {
            if(items?.activeItem?.categoryId !== props.categoryId) {
                setItems([]);
            }
        }

        setActivePhoto(props.id);
    });

    return (
        <>
            {c()}
        </>
    );
};

export default PhotoLoader;
