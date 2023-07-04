import { Component } from 'solid-js';

import { useCategoryContext } from '../../contexts/CategoryContext';
import { useCategoryFilterSettingsContext } from '../../contexts/settings/CategoryFilterSettingsContext';
import { allYearFilterId } from '../../models/YearFilter';
import { equalsIgnoreCase } from '../../models/utils/StringUtils';
import { useSearchParams } from '@solidjs/router';

import Select from '../../settings/components/Select';

const YearFilter: Component = () => {
    const [categoryState, { getAllYears }] = useCategoryContext();
    const [filter, { setYearFilter }] = useCategoryFilterSettingsContext();
    const [searchParams, setSearchParams] = useSearchParams();

    const onChangeFilter = (val: string) => {
        if(equalsIgnoreCase(val, allYearFilterId)) {
            setSearchParams({year: val});
            setYearFilter(val);
        } else {
            const year = parseInt(val);
            setSearchParams({year: year});
            setYearFilter(year);
        }
    };

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
};

export default YearFilter;
