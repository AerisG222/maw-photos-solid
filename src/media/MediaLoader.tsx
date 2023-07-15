import { ParentComponent, children, createEffect } from 'solid-js';
import { useParams } from '@solidjs/router';

import { categoryTypes } from '../_models/CategoryTypes';
import { useMediaListContext } from '../contexts/MediaListContext';
import { ICategoryService } from '../_services/categories/ICategoryService';

const MediaLoader: ParentComponent = (props) => {
    const params = useParams();
    const categoryService = categoryTypes[params.categoryType].svc as ICategoryService;
    const mediaResource = categoryService.loadMedia(parseInt(params.categoryId, 10));
    const [, { setItems }] = useMediaListContext();

    const c = children(() => props.children);

    createEffect(() => {
        if(!mediaResource.loading && !mediaResource.error) {
            setItems(mediaResource());
        }
    });

    return (
        <>
            {c()}
        </>
    );
};

export default MediaLoader;
