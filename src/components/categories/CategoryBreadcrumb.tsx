import { Component } from 'solid-js';
import { useCategory } from '../../contexts/CategoryContext';

const CategoryBreadcrumb: Component = () => {
    const [state] = useCategory();

    return (
        <div class="text-center">
            <span>{state.activeCategory.year}</span>
            <span class="text-6 i-ic-round-arrow-right" />
            <span>{state.activeCategory.name}</span>
        </div>
    );
};

export default CategoryBreadcrumb;
