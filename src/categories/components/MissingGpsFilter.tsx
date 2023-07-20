import { Component } from 'solid-js';

import Checkbox from '../../settings/components/Checkbox';
import { useCategoryContext } from '../../contexts/CategoryContext';
import { Category } from '../../_models/Category';

const MissingGpsFilter: Component = () => {
    const GPS_FILTER = "gps-filter";
    const [, { addFilter, removeFilter }] = useCategoryContext();

    const updateFilter = (enableFilter: boolean) => {
        removeFilter(GPS_FILTER);

        if(enableFilter) {
            addFilter({
                name: GPS_FILTER,
                filterFn: (c: Category) => c.isMissingGpsData
            });
        }
    };

    return (
        <div class="mt-auto">
            <Checkbox
                title="Missing GPS"
                name="missing_gps"
                isSelected={false}
                onChange={updateFilter} />
        </div>
    )
}

export default MissingGpsFilter;
