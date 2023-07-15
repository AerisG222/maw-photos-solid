import { ParentComponent, children, createEffect } from 'solid-js';

import { useCategoryContext } from './contexts/CategoryContext';
import { categoryTypes } from './_models/CategoryTypes';

const CategoryLoader: ParentComponent = (props) => {
    const [, { addCategories }] = useCategoryContext();

    const resources = [];

    for(const categoryTypeInfo in categoryTypes) {
        resources.push({
            res: categoryTypes[categoryTypeInfo].svc.load(),
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
