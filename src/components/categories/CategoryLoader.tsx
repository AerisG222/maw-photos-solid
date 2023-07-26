import { ParentComponent, children, createEffect, createResource } from 'solid-js';

import { useCategoryContext } from '../../contexts/CategoryContext';
import { categoryTypes } from '../../_models/CategoryTypes';
import { isLoggedIn } from '../../auth/auth';
import { getCategoryService } from '../../_services/categories/CategoryServiceLocator';
import { CategoryType } from '../../_models/CategoryType';

const CategoryLoader: ParentComponent = (props) => {
    const [, { addCategories }] = useCategoryContext();

    const resources = [];

    for(const categoryTypeInfo in categoryTypes) {
        resources.push({
            res: createResource(isLoggedIn, async (isLoggedIn) => isLoggedIn ?  getCategoryService(categoryTypeInfo as CategoryType).load() : [])[0],
            processed: false
        });
    }

    const c = children(() => props.children);

    createEffect(() => {
        resources
            .filter(r => r.res.state === "ready" && !r.processed)
            .map(r => {
                r.processed = true;
                addCategories(r.res());
            });
    });

    return (
        <>
            {c()}
        </>
    );
};

export default CategoryLoader;
