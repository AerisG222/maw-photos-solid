import { ParentComponent, children, createEffect, createResource } from "solid-js";

import { useCategoryContext } from "../../contexts/CategoryContext";
import { categoryTypes } from "../../_models/CategoryTypes";
import { getCategoryService } from "../../_services/categories/CategoryServiceLocator";
import { CategoryType } from "../../_models/CategoryType";
import { useAuthContext } from "../../contexts/AuthContext";

const CategoryLoader: ParentComponent = props => {
    const [authContext] = useAuthContext();
    const [, { setInitialized, addCategories }] = useCategoryContext();

    const resources = [];

    for (const categoryTypeInfo in categoryTypes) {
        resources.push({
            res: createResource(authContext.isLoggedIn, isLoggedIn =>
                isLoggedIn ? getCategoryService(categoryTypeInfo as CategoryType).load() : []
            )[0],
            processed: false
        });
    }

    const c = children(() => props.children);

    const checkInitializationStatus = () => {
        setInitialized(resources.find(r => !r.processed) === undefined);
    };

    createEffect(() => {
        resources
            .filter(r => r.res.state === "ready" && !r.processed)
            .map(r => {
                r.processed = true;
                addCategories(r.res());
                checkInitializationStatus();
            });
    });

    return <>{c()}</>;
};

export default CategoryLoader;
