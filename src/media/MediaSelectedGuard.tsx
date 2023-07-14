import { ParentComponent, children, createEffect } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';

import { useMediaListContext } from '../contexts/MediaListContext';
import { detailRoute, getMediaPath } from './_routes';
import { CategoryType } from '../models/CategoryType';

const MediaSelectedGuard: ParentComponent = (props) => {
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();
    const navigate = useNavigate();
    const params = useParams();
    const c = children(() => props.children);

    createEffect(() => {
        setActiveRouteDefinition(detailRoute);

        if(!params.id) {
            const m = mediaList.items[0];

            if(m) {
                navigate(getMediaPath(detailRoute, params.categoryType as CategoryType, m.categoryId, m.id));
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
