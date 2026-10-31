import { createMemo } from "solid-js";
import { getRouteApi } from "@tanstack/solid-router";

import { useGoTo } from "../../_media/services/_navigation";
import { CategoryFilters, validateCategoriesSearch } from "../_search";
import { countCategoryFilters } from "../_filters";

const route = getRouteApi("/categories");

/*
   Validated again here because the router's answer is not the validator's: it
   lays the result over the raw query string, so a value the validator dropped
   comes straight back.
*/
export const useCleanCategoriesSearch = () => {
    const search = route.useSearch();

    return createMemo(() =>
        validateCategoriesSearch(search() as Parameters<typeof validateCategoriesSearch>[0])
    );
};

/*
   The listing's filters, read from and written to the address. Replacing rather
   than pushing, so Back leaves the listing instead of undoing each click.
*/
export const useCategoryFilters = () => {
    const search = useCleanCategoriesSearch();
    const goTo = useGoTo();

    const update = (changes: CategoryFilters) =>
        goTo({ to: ".", search: { ...search(), ...changes } }, { replace: true });

    return {
        filters: search,
        activeCount: () => countCategoryFilters(search()),
        update,
        clear: () => goTo({ to: ".", search: { year: search().year } }, { replace: true })
    };
};
