import { Component } from "solid-js";

import { useCategoryMediaFilters } from "../hooks/useCategoryMediaFilters";

import FilterMenu from "../../_components/filters/FilterMenu";
import MediaFilterOptions from "../../_components/filters/MediaFilterOptions";

const CategoryFilterMenu: Component = () => {
    const { filters, activeCount, update, clear } = useCategoryMediaFilters();

    return (
        <FilterMenu
            activeCount={activeCount()}
            onClear={clear}
            toggleFavorites={() => update({ f: filters().f ? undefined : true })}
        >
            <MediaFilterOptions filters={filters()} onChange={update} />
        </FilterMenu>
    );
};

export default CategoryFilterMenu;
