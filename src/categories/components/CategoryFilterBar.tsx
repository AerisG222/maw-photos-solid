import { Component, Show } from 'solid-js';

import { isAdmin } from '../../auth/auth';

import CategoryTypeFilter from './CategoryTypeFilter';
import YearFilter from './YearFilter';
import MissingGpsFilter from './MissingGpsFilter';

const CategoryFilterBar: Component = () => {
    return (
        <div class="flex flex-gap-8 justify-center">
            <YearFilter />
            <CategoryTypeFilter />

            <Show when={isAdmin()}>
                <MissingGpsFilter />
            </Show>
        </div>
    );
};

export default CategoryFilterBar;
