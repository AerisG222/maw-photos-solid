import { Component } from "solid-js";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";

import Checkbox from "../../_components/input/Checkbox";

const MissingGpsFilter: Component = () => {
    const [area, { setCategoryMissingGpsFilter }] = useAreaSettingsContext();

    const updateFilter = (enableFilter: boolean) => {
        setCategoryMissingGpsFilter(enableFilter);
    };

    return (
        <div class="mt-auto">
            <Checkbox
                title="Missing GPS"
                name="missing_gps"
                isSelected={area.categoryMissingGpsFilter}
                onChange={updateFilter}
            />
        </div>
    );
};

export default MissingGpsFilter;
