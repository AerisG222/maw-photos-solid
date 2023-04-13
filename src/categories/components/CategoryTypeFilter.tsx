import { Component } from 'solid-js';
import Select from '../../settings/components/Select';
import { CategoryTypeFilterIdType, allCategoryTypeFilters } from '../../models/CategoryTypeFilter';

export type Props = {
    selectedCategoryFilterType: CategoryTypeFilterIdType;
}

const CategoryTypeFilter: Component<Props> = (props) => {
    const onChangeFilter = (val: string) => {
        console.log(val);
    }

    return (
        <>
            <Select title='Category Type' itemArray={allCategoryTypeFilters} selectedValue={props.selectedCategoryFilterType} onChange={onChangeFilter} />
        </>
    );
}

export default CategoryTypeFilter;
