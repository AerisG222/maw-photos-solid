import { createMemo } from "solid-js";
import { getRouteApi } from "@tanstack/solid-router";

import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";
import { MediaFilters, countMediaFilters, validateMediaFilters } from "../../_models/MediaFilters";
import { useGoTo } from "../../_media/services/_navigation";

const route = getRouteApi("/categories/$categoryYear/$categorySlug");

/*
   A category's filters, read from and written to the address, which every link
   within the category carries along - see `categoryViewLink` - and remembered for
   the next category. Replacing rather than pushing, so Back leaves the category
   instead of undoing each click.
*/
export const useCategoryMediaFilters = () => {
    const search = route.useSearch();
    const goTo = useGoTo();
    const [, { setCategoryMediaFilters }] = useAreaSettingsContext();
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
        update: (changes: MediaFilters) => {
            const next = { ...filters(), ...changes };

            setCategoryMediaFilters(next);
            goTo({ to: ".", search: next }, { replace: true });
        },
        clear: () => {
            setCategoryMediaFilters({});
            goTo({ to: ".", search: {} }, { replace: true });
        }
    };
};
