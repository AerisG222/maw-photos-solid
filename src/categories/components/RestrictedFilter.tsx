import { Component } from "solid-js";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";

import Checkbox from "../../_components/input/Checkbox";

// the categories holding a restricted photo - including any hidden from you
const RestrictedFilter: Component = () => {
    const [area, { setCategoryRestrictedFilter }] = useAreaSettingsContext();

    return (
        <div class="mt-auto">
            <Checkbox
                title="Restricted"
                name="restricted"
                isSelected={area.categoryRestrictedFilter}
                onChange={setCategoryRestrictedFilter}
            />
        </div>
    );
};

export default RestrictedFilter;
