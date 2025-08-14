import { ParentComponent, children, createEffect, onCleanup } from "solid-js";

import { useCategoryContext } from "../contexts/CategoryContext";
import { CategoryType, CategoryTypePhotos, CategoryTypeVideos } from "../_models/CategoryType";
import { useCategoryTeaserServiceContext } from "./contexts/CategoryTeaserServiceContext";
import { photoMediaService } from "../_services/media/PhotoMediaService";
import { videoMediaService } from "../_services/media/VideoMediaService";
import { useParams } from "@solidjs/router";

const ActiveCategoryMonitor: ParentComponent = props => {
    const [categoryContext, { setActiveCategory, setActiveCategoryById }] = useCategoryContext();
    const [, { setService: setCategoryTeaserService }] = useCategoryTeaserServiceContext();
    const c = children(() => props.children);
    const params = useParams();

    createEffect(() => {
        if (params.categoryType && params.categoryId) {
            setActiveCategoryById(
                params.categoryType as CategoryType,
                parseInt(params.categoryId, 10)
            );
        }
    });

    createEffect(() => {
        switch (categoryContext.activeCategory?.type) {
            case CategoryTypePhotos:
                setCategoryTeaserService(photoMediaService);
                break;
            case CategoryTypeVideos:
                setCategoryTeaserService(videoMediaService);
                break;
        }
    });

    onCleanup(() => {
        setActiveCategory(undefined);
    });

    return <>{c()}</>;
};

export default ActiveCategoryMonitor;
