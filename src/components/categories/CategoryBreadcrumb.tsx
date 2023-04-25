import { Component } from 'solid-js';
import { useCategoryContext } from '../../contexts/CategoryContext';
import { A } from '@solidjs/router';

const CategoryBreadcrumb: Component = () => {
    const [state] = useCategoryContext();

    // todo: can we make active category more robust so it is not null in some instances?
    return (
        <div class="text-center">
            <A class="color-primary" href={`/categories?year=${state.activeCategory?.year}`}>{state.activeCategory?.year}</A>
            <span class="text-6 i-ic-round-arrow-right" />
            <span>{state.activeCategory?.name}</span>
        </div>
    );
};

export default CategoryBreadcrumb;
