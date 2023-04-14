import { Component } from 'solid-js';

import CategoryTypeFilter from './CategoryTypeFilter';
import YearFilter from './YearFilter';

const CategoryFilterBar: Component = () => {
    return (
        <div class="flex flex-gap-8 justify-center">
            <YearFilter />
            <CategoryTypeFilter />
        </div>
    );
}

export default CategoryFilterBar;
