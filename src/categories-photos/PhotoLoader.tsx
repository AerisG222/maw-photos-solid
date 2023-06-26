import { ParentComponent, children, createEffect, createResource } from 'solid-js';

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

    const c = children(() => props.children);

    createEffect(() => {
        setActivePhotoCategory(props.categoryId);

        if(!photosResource.loading && !photosResource.error) {
            setPhotos(photosResource());
        } else {
            if(photos?.activePhoto?.categoryId !== props.categoryId) {
                setPhotos([]);
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
