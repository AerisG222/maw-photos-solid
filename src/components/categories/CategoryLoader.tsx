import { ParentComponent, Show, children, createResource, createSignal } from "solid-js";

import { useCategoryContext } from "../../contexts/CategoryContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { categoryService } from "../../_services/categories/CategoryService";

const CategoryLoader: ParentComponent = props => {
    const [isInitialized, setIsInitialized] = createSignal(false);
    const [authContext] = useAuthContext();
    const [, { addCategories }] = useCategoryContext();

    const categoryResource = createResource(authContext.isLoggedIn, isLoggedIn => {
        if (isLoggedIn) {
            var categories = categoryService.load();
            addCategories(categories);
            setIsInitialized(true);
        }
    });

    const c = children(() => props.children);

    return <Show when={isInitialized}>{c()}</Show>;
};

export default CategoryLoader;
