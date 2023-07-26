import { ParentComponent, children, createEffect, createResource } from 'solid-js';

import { categoryTypes } from '../../_models/CategoryTypes';
import { useMediaListContext } from '../../contexts/MediaListContext';
import { useCategoryContext } from '../../contexts/CategoryContext';
import { MediaListModeCategory } from '../../_models/Media';

const MediaCategoryLoader: ParentComponent = (props) => {
    const [mediaContext] = useMediaListContext();
    const [categoryContext] = useCategoryContext();
    const [, { setItems }] = useMediaListContext();

    const loadMedia = () => {
        if(mediaContext.mode !== MediaListModeCategory) {
            return;
        }

        const cat = categoryContext.activeCategory;

        if(cat) {
            const svc = categoryTypes[cat.type].svc;
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
