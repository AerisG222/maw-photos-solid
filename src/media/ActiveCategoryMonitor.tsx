import { ParentComponent, children, createEffect } from 'solid-js';

import { useCategoryContext } from '../contexts/CategoryContext';
import { CategoryTypePhotos, CategoryTypeVideos } from '../_models/CategoryType';
import { useCategoryTeaserServiceContext } from '../contexts/CategoryTeaserServiceContext';
import { photoMediaService } from '../_services/media/PhotoMediaService';
import { videoMediaService } from '../_services/media/VideoMediaService';

const ActiveCategoryMonitor: ParentComponent = (props) => {
    const [categoryContext] = useCategoryContext();
    const [, { setService: setCategoryTeaserService }] = useCategoryTeaserServiceContext();

    const c = children(() => props.children);

    createEffect(() => {
        switch(categoryContext.activeCategory?.type) {
            case CategoryTypePhotos:
                setCategoryTeaserService(photoMediaService);
                break;
            case CategoryTypeVideos:
                setCategoryTeaserService(videoMediaService);
                break;
        }
    });

    return (
        <>
            {c()}
        </>
    );
};

export default ActiveCategoryMonitor;
