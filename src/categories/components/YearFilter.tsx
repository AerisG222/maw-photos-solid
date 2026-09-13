import { Component, Show } from "solid-js";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";
import { useSearchParams } from "@solidjs/router";

import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";

import Select from "../../_components/input/Select";

const YearFilter: Component = () => {
    const { yearsQuery } = useCategoriesContext();
    const [area, { setCategoryYearFilter }] = useAreaSettingsContext();
    const [searchParams, setSearchParams] = useSearchParams();

    const onChangeFilter = (val: string) => {
        let yearFilter: number | "all";

        if (val === "all") {
            yearFilter = "all";
        } else {
            yearFilter = parseInt(val, 10);

            if (isNaN(yearFilter)) {
                yearFilter = "all";
            }
        }

        setCategoryYearFilter(yearFilter);
        setSearchParams({ year: yearFilter.toString() });
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

    if (searchParams.year) {
        onChangeFilter(searchParams.year as string);
    }

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
