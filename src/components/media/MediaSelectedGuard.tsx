import { ParentComponent, children, createEffect } from 'solid-js';
import { useLocation, useNavigate, useParams } from '@solidjs/router';

import { useMediaListContext } from '../../contexts/MediaListContext';
import { categoriesPhotosDetail, getPhotoCategoryRoutePath } from '../../categories-photos/_routes';
import { categoriesVideosDetail, getVideoCategoryRoutePath } from '../../categories-videos/_routes';

const MediaSelectedGuard: ParentComponent = (props) => {
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const c = children(() => props.children);

    createEffect(() => {
        if(location.pathname.indexOf('photos') >= 0) {
            setActiveRouteDefinition(categoriesPhotosDetail);

            if(!params.id) {
                const m = mediaList.items[0];

                if(m) {
                    navigate(getPhotoCategoryRoutePath(categoriesPhotosDetail, m.categoryId, m.id));
                }
            }
        }

        if(location.pathname.indexOf('videos') >= 0) {
            setActiveRouteDefinition(categoriesVideosDetail);

            if(!params.id) {
                const m = mediaList.items[0];

                if(m) {
                    navigate(getVideoCategoryRoutePath(categoriesVideosDetail, m.categoryId, m.id));
                }
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
