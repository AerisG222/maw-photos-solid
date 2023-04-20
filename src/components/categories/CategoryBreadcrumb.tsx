import { Component } from 'solid-js';

const CategoryBreadcrumb: Component = () => {
    const category = { year: 1, name: 'x'};

    return (
        <div class="text-center">
            <span>{category.year}</span>
            <span class="text-6 i-ic-round-arrow-right" />
            <span>{category.name}</span>
        </div>
    );
};

export default CategoryBreadcrumb;
