import { ParentComponent, children, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';

import { useMediaListContext } from '../contexts/MediaListContext';
import { detailRoute, getMediaPath } from './_routes';
import { useCategoryContext } from '../contexts/CategoryContext';

const MediaSelectedGuard: ParentComponent = (props) => {
    const [categoryContext] = useCategoryContext();
    const [mediaList] = useMediaListContext();
    const navigate = useNavigate();
    const c = children(() => props.children);

    createEffect(() => {
        if(categoryContext.activeCategory &&
            mediaList.items &&
            mediaList.items.length > 0 &&
            !mediaList.activeItem) {
            const m = mediaList.items[0];

            if(m) {
                navigate(getMediaPath(detailRoute, categoryContext.activeCategory.type, m.categoryId, m.id));
            }
        }
    });

    return(
        <>
            {c()}
        </>
    );
};

export default MediaSelectedGuard;
