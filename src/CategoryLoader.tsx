import { ParentComponent, children, createEffect, createResource } from 'solid-js';

import { isLoggedIn } from './auth/auth';
import { getPhotoCategories } from './api/PhotoCategories';
import { getVideoCategories } from './api/VideoCategories';
import { useCategoryContext } from './contexts/CategoryContext';

const CategoryLoader: ParentComponent = (props) => {
    const [categoryState, { setPhotoCategories, setVideoCategories }] = useCategoryContext();

    const getPhotoCats = (isLoggedIn) => isLoggedIn ? getPhotoCategories() : null;
    const getVideoCats = (isLoggedIn) => isLoggedIn ? getVideoCategories() : null;

    const [photoCategories] = createResource(isLoggedIn, getPhotoCats);
    const [videoCategories] = createResource(isLoggedIn, getVideoCats);

    const c = children(() => props.children);

    createEffect(() => {
        setPhotoCategories(photoCategories() ?? []);
        setVideoCategories(videoCategories() ?? []);
    });

    return (
        <>
            {c()}
        </>
    );
};

export default CategoryLoader;
