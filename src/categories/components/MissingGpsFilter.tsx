import { Component } from "solid-js";

import Checkbox from "../../components/input/Checkbox";
import { useCategoryFilterSettingsContext } from "../../contexts/settings/CategoryFilterSettingsContext";

type Props = {
    horizontal: boolean;
};

const MissingGpsFilter: Component<Props> = props => {
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
