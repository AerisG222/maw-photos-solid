import { Component } from 'solid-js';
import { useCategory } from '../../contexts/CategoryContext';
import Select from '../../settings/components/Select';

const YearFilter: Component = () => {
    const [categoryState, { getAllYears }] = useCategory();

    const onChangeFilter = (val: string) => {
        console.log(val);
    }

    const toKvp = (allYears: number[]) => allYears.map(y => {
        return {
            id: y,
            name: y.toString()
        };
    });

    return (
        <>
            <Select title='Year' itemArray={toKvp(getAllYears())} selectedValue={-1} onChange={onChangeFilter} />
        </>
    );
}

export default YearFilter;
