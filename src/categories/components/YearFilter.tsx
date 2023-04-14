import { Component } from 'solid-js';
import { useCategory } from '../../contexts/CategoryContext';
import Select from '../../settings/components/Select';
import { useCategoryFilterSettings } from '../../contexts/CategoryFilterSettingsContext';

const YearFilter: Component = () => {
    const [categoryState, { getAllYears }] = useCategory();
    const [filter, { setYearFilter }] = useCategoryFilterSettings();

    const onChangeFilter = (val: string) => {
        setYearFilter(val);
    }

    const toKvp = (allYears: number[]) => allYears.map(y => {
        return {
            id: y,
            name: y.toString()
        };
    });

    return (
        <>
            <Select title='Year' itemArray={toKvp(getAllYears())} selectedValue={filter.yearFilter} onChange={onChangeFilter} />
        </>
    );
}

export default YearFilter;
