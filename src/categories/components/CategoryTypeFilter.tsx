import { Component, batch, createEffect, untrack } from 'solid-js';
import { useSearchParams } from '@solidjs/router';

import { useCategoryFilterSettingsContext } from '../../contexts/settings/CategoryFilterSettingsContext';
import { useCategoryContext } from '../../contexts/CategoryContext';
import { Category } from '../../models/Category';
import { categoryTypesOptions } from '../../models/CategoryTypes';

import Select from '../../settings/components/Select';

const CategoryTypeFilter: Component = () => {
    const TYPE_FILTER = "CategoryTypeFilter_Type";
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, { setTypeFilter }] = useCategoryFilterSettingsContext();
    const [, { addFilter, removeFilter }] = useCategoryContext();

    createEffect(() => {
        if(searchParams.type) {
            // not fully sure why untrack is required, but the addFilter call seems to cause this to recurse otherwise
            untrack(() => {
                batch(() => {
                    setTypeFilter(searchParams.type);

                    removeFilter(TYPE_FILTER);

                    if(searchParams.type !== 'all') {
                        addFilter({
                            name: TYPE_FILTER,
                            filterFn: (c: Category) => c.type === searchParams.type
                        });
                    }
                });
            });
        }
    });

    const onChangeFilter = (val: string) => setSearchParams({type: val});

    return (
        <>
            <Select
                title='Category Type'
                itemArray={categoryTypesOptions}
                selectedValue={filter.typeFilter}
                onChange={onChangeFilter} />
        </>
    );
};

export default CategoryTypeFilter;
