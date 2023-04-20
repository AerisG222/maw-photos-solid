import { Component } from 'solid-js';

import { useCategoryContext } from '../../contexts/CategoryContext';
import { useCategoryFilterSettingsContext } from '../../contexts/CategoryFilterSettingsContext';

import Select from '../../settings/components/Select';
import { allYearFilterId } from '../../models/YearFilter';
import { equalsIgnoreCase } from '../../models/Utils';

const YearFilter: Component = () => {
    const [categoryState, { getAllYears }] = useCategoryContext();
    const [filter, { setYearFilter }] = useCategoryFilterSettingsContext();

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
