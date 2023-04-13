import { Component } from 'solid-js';

import CategoryTypeFilter from './CategoryTypeFilter';
import YearFilter from './YearFilter';

const CategoryFilterBar: Component = () => {
    return (
        <div>
            <YearFilter />
            <CategoryTypeFilter selectedCategoryFilterType="" />
        </div>
    );
}

export default CategoryFilterBar;
