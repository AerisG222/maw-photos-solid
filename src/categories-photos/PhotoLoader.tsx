import { ParentComponent, batch, createEffect, createResource } from 'solid-js';

import { getPhotos } from '../api/PhotoCategories';
import { useCategoryContext } from '../contexts/CategoryContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';

type Props = {
    categoryId: number;
    photoId: number | undefined;
};

const PhotoListLoader: ParentComponent<Props> = (props) => {
    const [photosResource] = createResource(props.categoryId, getPhotos);
    const [categoryState, { setActivePhotoCategory }] = useCategoryContext();
    const [photos, { setPhotos, setActivePhoto }] = usePhotoListContext();

    createEffect(() => {
        if(!photosResource.loading && !photosResource.error) {
            batch(() => {
                setActivePhotoCategory(props.categoryId);
                setPhotos(photosResource().items);
            });
        }

        setActivePhoto(props.photoId);
    });

    return (
        <>
            {props.children}
        </>
    )
};

export default PhotoListLoader;
