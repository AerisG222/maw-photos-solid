import { Component } from "solid-js";

import Checkbox from "../../components/input/Checkbox";
import { useCategoryContext } from "../../contexts/CategoryContext";
import { Category } from "../../_models/Category";
import { useCategoryFilterSettingsContext } from '../../contexts/settings/CategoryFilterSettingsContext';

type Props = {
    horizontal: boolean;
}

const MissingGpsFilter: Component<Props> = (props) => {
    const GPS_FILTER = "gps-filter";
    const [, { addFilter, removeFilter }] = useCategoryContext();
    const [filter, { setMissingGpsFilter }] = useCategoryFilterSettingsContext();

    const updateFilter = (enableFilter: boolean) => {
        setMissingGpsFilter(enableFilter);
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
                isSelected={filter.missingGpsFilter}
                onChange={updateFilter} />
        </div>
    )
}

export default MissingGpsFilter;
