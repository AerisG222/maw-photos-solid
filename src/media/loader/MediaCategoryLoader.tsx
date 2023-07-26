import { ParentComponent, children, createEffect, createResource } from 'solid-js';

import { useMediaListContext } from '../contexts/MediaListContext';
import { useCategoryContext } from '../../contexts/CategoryContext';
import { getCategoryService } from '../../_services/categories/CategoryServiceLocator';
import { useRouteDetailContext } from '../../contexts/RouteDetailContext';
import { AreaCategories } from '../../_models/AppRouteDefinition';

const MediaCategoryLoader: ParentComponent = (props) => {
    const [routeContext] = useRouteDetailContext();
    const [categoryContext] = useCategoryContext();
    const [, { setItems }] = useMediaListContext();

    const loadMedia = () => {
        // todo: is this check necessary?
        if(routeContext.area !== AreaCategories) {
            return;
        }

        const cat = categoryContext.activeCategory;

        if(cat) {
            const svc = getCategoryService(cat.type);
            return svc.loadMedia(cat.id);
        }

        return [];
    };

    const [mediaResource] = createResource(categoryContext.activeCategory, loadMedia);

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

export default MediaCategoryLoader;
