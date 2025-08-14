import { ParentComponent, children, createEffect, onCleanup } from "solid-js";

import { useCategoryContext } from "../contexts/CategoryContext";
import { useCategoryTeaserServiceContext } from "./contexts/CategoryTeaserServiceContext";
import { mediaService } from "../_services/media/MediaService";
import { useParams } from "@solidjs/router";

const ActiveCategoryMonitor: ParentComponent = props => {
    const [categoryContext, { setActiveCategory, setActiveCategoryById }] = useCategoryContext();
    const [, { setService: setCategoryTeaserService }] = useCategoryTeaserServiceContext();
    const c = children(() => props.children);
    const params = useParams();

    createEffect(() => {
        if (params.categoryId) {
            setActiveCategoryById(params.categoryId);
        }
    });

    setCategoryTeaserService(mediaService);

    onCleanup(() => {
        setActiveCategory(undefined);
    });

    return <>{c()}</>;
};

export default ActiveCategoryMonitor;
