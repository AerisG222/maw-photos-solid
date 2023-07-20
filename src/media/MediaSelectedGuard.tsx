import { ParentComponent, children, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';

import { useMediaListContext } from '../contexts/MediaListContext';
import { getMediaPath } from './_routes';
import { useCategoryContext } from '../contexts/CategoryContext';
import { AppRouteDefinition } from '../_models/AppRouteDefinition';

type Props = {
    targetRoute: AppRouteDefinition;
};

const MediaSelectedGuard: ParentComponent<Props> = (props) => {
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
                navigate(getMediaPath(props.targetRoute, categoryContext.activeCategory.type, m.categoryId, m.id));
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