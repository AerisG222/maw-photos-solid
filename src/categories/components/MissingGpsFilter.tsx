import { Component } from "solid-js";

import Checkbox from "../../_components/input/Checkbox";

import { useCategoryFilterSettingsContext } from "../../_contexts/settings/CategoryFilterSettingsContext";

const MissingGpsFilter: Component = () => {
    const [filter, { setMissingGpsFilter }] = useCategoryFilterSettingsContext();

    const updateFilter = (enableFilter: boolean) => {
        setMissingGpsFilter(enableFilter);
    };

    return (
        <div class="mt-auto">
            <Checkbox
                title="Missing GPS"
                name="missing_gps"
                isSelected={filter.missingGpsFilter}
                onChange={updateFilter}
            />
        </div>
    );
};

export default MissingGpsFilter;
