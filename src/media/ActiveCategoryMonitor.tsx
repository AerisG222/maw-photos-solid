import { ParentComponent, children, createEffect, onCleanup } from "solid-js";

import { useCategoryContext } from "../_contexts/CategoryContext";
import { useParams } from "@solidjs/router";

const ActiveCategoryMonitor: ParentComponent = props => {
    const [categoryContext, { setActiveCategory, setActiveCategoryById }] = useCategoryContext();
    const c = children(() => props.children);
    const params = useParams();

    createEffect(() => {
        if (params.categoryId) {
            setActiveCategoryById(params.categoryId as Uuid);
        }
    });

    onCleanup(() => {
        setActiveCategory(undefined);
    });

    return <>{c()}</>;
};

export default ActiveCategoryMonitor;
