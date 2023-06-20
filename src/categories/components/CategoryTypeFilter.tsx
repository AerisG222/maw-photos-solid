import { Component } from 'solid-js';
import Select from '../../settings/components/Select';
import { allCategoryTypeFilters } from '../../models/CategoryTypeFilter';
import { useCategoryFilterSettingsContext } from '../../contexts/settings/CategoryFilterSettingsContext';

const CategoryTypeFilter: Component = () => {
    const [filter, { setTypeFilter }] = useCategoryFilterSettingsContext();

    const onChangeFilter = (val: string) => {
        setTypeFilter(val);
    }

    return (
        <>
            <Select title='Category Type' itemArray={allCategoryTypeFilters} selectedValue={filter.typeFilter} onChange={onChangeFilter} />
        </>
    );
}

export default CategoryTypeFilter;
