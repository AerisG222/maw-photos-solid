import { Component } from 'solid-js';
import { useCategoryContext } from '../../contexts/CategoryContext';

const CategoryBreadcrumb: Component = () => {
    const [state] = useCategoryContext();

    return (
        <div class="text-center">
            <span>{state.activeCategory.year}</span>
            <span class="text-6 i-ic-round-arrow-right" />
            <span>{state.activeCategory.name}</span>
        </div>
    );
};

export default CategoryBreadcrumb;
