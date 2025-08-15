import { Component } from "solid-js";
import { useSearchParams } from "@solidjs/router";

import { useCategoryContext } from "../../_contexts/CategoryContext";
import { useCategoryFilterSettingsContext } from "../../_contexts/settings/CategoryFilterSettingsContext";

import Select from "../../_components/input/Select";

type Props = {
    horizontal: boolean;
};

const YearFilter: Component<Props> = props => {
    const [, { getAllYears }] = useCategoryContext();
    const [filter, { setYearFilter }] = useCategoryFilterSettingsContext();
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

        setYearFilter(yearFilter);
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

    if (searchParams.year) {
        onChangeFilter(searchParams.year);
    }

    return (
        <Select
            horizontal={props.horizontal}
            title="Year"
            itemArray={toKvp(getAllYears())}
            selectedValue={filter.yearFilter ?? "all"}
            onChange={onChangeFilter}
        />
    );
};

export default YearFilter;
