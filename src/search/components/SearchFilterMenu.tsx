import { Component } from "solid-js";

import { useSearchFilters } from "../useSearchFilters";

import FilterMenu from "../../_components/filters/FilterMenu";
import MediaFilterOptions from "../../_components/filters/MediaFilterOptions";

// results arrive a page at a time, so unlike the categories page these are the API's to apply
const SearchFilterMenu: Component = () => {
    const { filters, activeCount, update, clear } = useSearchFilters();

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

export default SearchFilterMenu;
