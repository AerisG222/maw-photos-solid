import { Component, batch, createEffect, untrack } from "solid-js";
import { useSearchParams } from "@solidjs/router";

import { useCategoryContext } from "../../contexts/CategoryContext";
import { useCategoryFilterSettingsContext } from "../../contexts/settings/CategoryFilterSettingsContext";

import Select from "../../components/input/Select";
import { Category } from "../../_models/Category";

type Props = {
    horizontal: boolean;
}

const YearFilter: Component<Props> = (props) => {
    const YEAR_FILTER = "YearFilter_Year";
    const [, { getAllYears, addFilter, removeFilter }] = useCategoryContext();
    const [filter, { setYearFilter }] = useCategoryFilterSettingsContext();
    const [searchParams, setSearchParams] = useSearchParams();

    createEffect(() => {
        if(searchParams.year) {
            untrack(() => {
                batch(() => {
                    const yearFilter = searchParams.year === "all" ? undefined : parseInt(searchParams.year);

                    setYearFilter(yearFilter)

                    removeFilter(YEAR_FILTER);

                    if(yearFilter) {
                        addFilter({
                            name: YEAR_FILTER,
                            filterFn: (c: Category) => c.year === yearFilter
                        });
                    }
                });
            });
        }
    })

    const onChangeFilter = (val: string) => setSearchParams({year: val});

    const toKvp = (allYears: number[]) => !allYears ? [] : [
        { id: "all", name: "All" },
        ...allYears.map(y => {
            return {
                id: y,
                name: y.toString()
            };
        })
    ];

    return (
        <Select
            horizontal={props.horizontal}
            title="Year"
            itemArray={toKvp(getAllYears())}
            selectedValue={filter.yearFilter ?? "all"}
            onChange={onChangeFilter} />
    );
};

export default YearFilter;
