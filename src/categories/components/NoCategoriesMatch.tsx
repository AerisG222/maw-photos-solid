import { Component } from "solid-js";

import { useCategoryFilters } from "../hooks/useCategoryFilters";

import EmptyState from "../../_components/state/EmptyState";

const NoCategoriesMatch: Component = () => {
    const { clear } = useCategoryFilters();

    return (
        <EmptyState
            icon="icon-[ic--round-search-off]"
            title="No categories match these filters"
            actionLabel="Clear filters"
            onAction={clear}
        />
    );
};

export default NoCategoriesMatch;
