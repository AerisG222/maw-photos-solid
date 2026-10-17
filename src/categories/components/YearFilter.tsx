import { Component, createEffect, Show } from "solid-js";
import { getRouteApi, useNavigate } from "@tanstack/solid-router";

import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";

import Select from "../../_components/input/Select";

const route = getRouteApi("/categories");

/*
   The year being listed lives in two places: the address, so a link or a reload
   shows the same thing, and a setting, so coming back without one picks up
   where you were. The address wins - arriving with a year, or stepping back to
   one, becomes the setting too. This used to read the address and write both
   while it rendered.
*/
const YearFilter: Component = () => {
    const { yearsQuery } = useCategoriesContext();
    const [area, { setCategoryYearFilter }] = useAreaSettingsContext();
    const search = route.useSearch();
    const navigate = useNavigate();

    createEffect(() => {
        const year = search().year;

        if (year !== undefined && year !== area.categoryYearFilter) {
            setCategoryYearFilter(year);
        }
    });

    const onChangeFilter = (val: string) => {
        const parsed = parseInt(val, 10);
        const year = val === "all" || isNaN(parsed) ? "all" : parsed;

        setCategoryYearFilter(year);
        void navigate({ to: ".", search: { ...search(), year } });
    };

    const toKvp = (allYears: number[]) =>
        !allYears
            ? []
            : [
                  { id: "all", name: "All" },
                  ...allYears.map(y => {
                      return {
                          id: y,
                          name: y.toString()
                      };
                  })
              ];

    const years = yearsQuery();

    return (
        <Show when={years.isSuccess}>
            <Select
                title="Year"
                itemArray={toKvp(years.data!)}
                selectedValue={area.categoryYearFilter ?? "all"}
                onChange={onChangeFilter}
            />
        </Show>
    );
};

export default YearFilter;
