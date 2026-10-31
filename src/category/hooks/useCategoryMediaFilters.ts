import { createMemo } from "solid-js";
import { getRouteApi } from "@tanstack/solid-router";

import { MediaFilters, countMediaFilters, validateMediaFilters } from "../../_models/MediaFilters";
import { useGoTo } from "../../_media/services/_navigation";

const route = getRouteApi("/categories/$categoryYear/$categorySlug");

/*
   A category's filters, read from and written to the address, which every link
   within the category carries along - see `categoryViewLink`. Replacing rather
   than pushing, so Back leaves the category instead of undoing each click.
*/
export const useCategoryMediaFilters = () => {
    const search = route.useSearch();
    const goTo = useGoTo();
    /*
       Validated again here because the router's answer is not the validator's: it
       lays the result over the raw query string, so a value the validator dropped
       comes straight back - `?t=audio` hid every photo in the category.
    */
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
