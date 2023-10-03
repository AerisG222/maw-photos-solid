import { Component, createEffect, untrack } from "solid-js";
import { useSearchParams } from "@solidjs/router";

import { useCategoryFilterSettingsContext } from "../../contexts/settings/CategoryFilterSettingsContext";
import { categoryTypesOptions } from "../../_models/CategoryTypes";

import Select from "../../components/input/Select";

type Props = {
    horizontal: boolean;
}

const CategoryTypeFilter: Component<Props> = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, { setTypeFilter }] = useCategoryFilterSettingsContext();

    createEffect(() => {
        if(searchParams.type) {
            untrack(() => {
                setTypeFilter(searchParams.type);
            });
        }
    });

    const onChangeFilter = (val: string) => setSearchParams({type: val});

    return (
        <Select
            horizontal={props.horizontal}
            title="Category Type"
            itemArray={categoryTypesOptions}
            selectedValue={filter.typeFilter}
            onChange={onChangeFilter} />
    );
};

export default CategoryTypeFilter;
