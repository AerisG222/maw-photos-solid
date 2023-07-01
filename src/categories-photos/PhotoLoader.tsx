import { ParentComponent, children, createEffect, createResource } from 'solid-js';

import { getPhotos } from '../api/PhotoCategories';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useMediaListContext } from '../contexts/MediaListContext';

type Props = {
    categoryId: number;
    photoId: number | undefined;
};

const PhotoListLoader: ParentComponent<Props> = (props) => {
    const [photosResource] = createResource(props.categoryId, getPhotos);
    const [, { setActivePhotoCategory }] = useCategoryContext();
    const [items, { setItems, setActiveItem: setActivePhoto }] = useMediaListContext();

    const c = children(() => props.children);

    createEffect(() => {
        setActivePhotoCategory(props.categoryId);

        if(!photosResource.loading && !photosResource.error) {
            setItems(photosResource());
        } else {
            if(items?.activeItem?.categoryId !== props.categoryId) {
                setItems([]);
            }
        }

        setActivePhoto(props.photoId);
    });

    return (
        <>
            {c()}
        </>
    )
};

export default PhotoListLoader;
