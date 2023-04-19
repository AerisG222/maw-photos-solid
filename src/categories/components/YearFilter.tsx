import { Component } from 'solid-js';

import { useCategory } from '../../contexts/CategoryContext';
import { useCategoryFilterSettings } from '../../contexts/CategoryFilterSettingsContext';

import Select from '../../settings/components/Select';
import { allYearFilterId } from '../../models/YearFilter';
import { equalsIgnoreCase } from '../../models/Utils';

const YearFilter: Component = () => {
    const [categoryState, { getAllYears }] = useCategory();
    const [filter, { setYearFilter }] = useCategoryFilterSettings();

    const onChangeFilter = (val: string) => {
        if(equalsIgnoreCase(val, allYearFilterId)) {
            setYearFilter(val);
        } else {
            setYearFilter(parseInt(val));
        }
    }

    const toKvp = (allYears: number[]) => !allYears ? [] : [
        { id: allYearFilterId, name: 'All Years' },
        ...allYears.map(y => {
            return {
                id: y,
                name: y.toString()
            };
        })
    ];

    return (
        <Select
            title='Year'
            itemArray={toKvp(getAllYears())}
            selectedValue={filter.yearFilter}
            onChange={onChangeFilter} />
    );
}

export default YearFilter;
