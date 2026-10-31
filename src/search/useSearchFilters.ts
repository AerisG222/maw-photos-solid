import { createMemo } from "solid-js";
import { getRouteApi } from "@tanstack/solid-router";

import { useGoTo } from "../_media/services/_navigation";
import { MediaFilters, countMediaFilters, validateMediaFilters } from "../_models/MediaFilters";

const route = getRouteApi("/search");

/*
   Search's filters, read from and written to the address. The term itself is kept
   in SearchContext, where it has always been, so results come back when returning
   from a category.
*/
export const useSearchFilters = () => {
    const search = route.useSearch();
    const goTo = useGoTo();
    // validated again - see useCategoryMediaFilters
    const filters = createMemo(() =>
        validateMediaFilters(search() as unknown as Record<string, unknown>)
    );

    return {
        filters,
        activeCount: () => countMediaFilters(filters()),
        update: (changes: MediaFilters) =>
            goTo({ to: ".", search: { ...filters(), ...changes } }, { replace: true }),
        clear: () => goTo({ to: ".", search: {} }, { replace: true })
    };
};
