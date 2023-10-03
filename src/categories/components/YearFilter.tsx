import { Component } from "solid-js";
import { useSearchParams } from "@solidjs/router";

import { useCategoryContext } from "../../contexts/CategoryContext";
import { useCategoryFilterSettingsContext } from "../../contexts/settings/CategoryFilterSettingsContext";

import Select from "../../components/input/Select";

type Props = {
    horizontal: boolean;
};

const YearFilter: Component<Props> = (props) => {
    const [, { getAllYears }] = useCategoryContext();
    const [filter, { setYearFilter }] = useCategoryFilterSettingsContext();
    const [searchParams, setSearchParams] = useSearchParams();

    const onChangeFilter = (val: string) => {
        const yearFilter = val === "all" ? undefined : parseInt(searchParams.year);

        setYearFilter(yearFilter);
        setSearchParams({year: val});
    };

    const toKvp = (allYears: number[]) => !allYears ? [] : [
        { id: "all", name: "All" },
        ...allYears.map(y => {
            return {
                id: y,
                name: y.toString()
            };
        })
    ];

    if(searchParams.year) {
        onChangeFilter(searchParams.year);
    }

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
