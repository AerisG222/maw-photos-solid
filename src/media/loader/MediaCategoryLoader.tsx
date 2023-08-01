import { ParentComponent, children, createEffect, createResource, createSignal } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";
import { useCategoryContext } from "../../contexts/CategoryContext";
import { getCategoryService } from "../../_services/categories/CategoryServiceLocator";

const MediaCategoryLoader: ParentComponent = (props) => {
    const [doFetch, setDoFetch] = createSignal(-1);
    const [categoryContext] = useCategoryContext();
    const [, { setItems }] = useMediaListContext();
    const c = children(() => props.children);

    const loadMedia = () => {
        const cat = categoryContext.activeCategory;

        if(cat) {
            const svc = getCategoryService(cat.type);
            return svc.loadMedia(cat.id);
        }

        return [];
    };

    // odd - when the first arg was categoryContext.activeCategory, this would fail to load on
    // the initial display so manually wired up the signal - perhaps related to:
    // https://github.com/solidjs/solid/issues/1741
    const [mediaResource] = createResource(doFetch, loadMedia);

    createEffect(() => {
        setDoFetch(categoryContext.activeCategory?.id);
    });

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
