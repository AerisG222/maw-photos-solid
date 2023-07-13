import { Component, batch, createEffect, untrack } from 'solid-js';
import { useSearchParams } from '@solidjs/router';

import { useCategoryContext } from '../../contexts/CategoryContext';
import { useCategoryFilterSettingsContext } from '../../contexts/settings/CategoryFilterSettingsContext';
import { allYearFilterId } from '../../models/YearFilter';

import Select from '../../settings/components/Select';
import { Category } from '../../models/Category';

const YearFilter: Component = () => {
    const YEAR_FILTER = "YearFilter_Year";
    const [, { getAllYears, addFilter, removeFilter }] = useCategoryContext();
    const [filter, { setYearFilter }] = useCategoryFilterSettingsContext();
    const [searchParams, setSearchParams] = useSearchParams();

    createEffect(() => {
        if(searchParams.year) {
            untrack(() => {
                batch(() => {
                    setYearFilter(parseInt(searchParams.year))

                    removeFilter(YEAR_FILTER);

                    if(searchParams.year !== 'all') {
                        addFilter({
                            name: YEAR_FILTER,
                            filterFn: (c: Category) => c.year === parseInt(searchParams.year)
                        });
                    }
                });
            });
        }
    })

    const onChangeFilter = (val: string) => setSearchParams({year: val});

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
