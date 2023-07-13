import { ParentComponent, children, createEffect } from 'solid-js';

import { useCategoryContext } from './contexts/CategoryContext';
import { photoCategoryService } from './_services/categories/PhotoCategoryService';
import { videoCategoryService } from './_services/categories/VideoCategoryService';

const CategoryLoader: ParentComponent = (props) => {
    const [, { addCategories }] = useCategoryContext();

    const photoCategories = photoCategoryService.load();
    const videoCategories = videoCategoryService.load();

    const c = children(() => props.children);

    createEffect(() => {
        if(photoCategories.state === "ready") {
            addCategories(photoCategories() ?? []);
        }
    });

    createEffect(() => {
        if(videoCategories.state === "ready") {
            addCategories(videoCategories() ?? []);
        }
    })

    return (
        <>
            {c()}
        </>
    );
};

export default CategoryLoader;
