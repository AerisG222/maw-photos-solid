import { Component } from "solid-js";

import { useCategoryFilters } from "../hooks/useCategoryFilters";

import FilterMenu from "../../_components/filters/FilterMenu";
import CategoryFilterOptions from "../../_components/filters/CategoryFilterOptions";

const CategoriesFilterMenu: Component = () => {
    const { filters, activeCount, update, clear } = useCategoryFilters();

    return (
        <FilterMenu
            activeCount={activeCount()}
            onClear={clear}
            toggleFavorites={() => update({ f: filters().f ? undefined : true })}
        >
            <CategoryFilterOptions filters={filters()} onChange={update} />
        </FilterMenu>
    );
};

export default CategoriesFilterMenu;
