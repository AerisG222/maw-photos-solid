import { Component } from "solid-js";

import { KeyValuePair } from "../../_models/KeyValuePair";

import RadioGroup from "../../_components/input/RadioGroup";

/*
   One choice rather than a checkbox per filter: "without gps" and "with an
   override" cannot both hold for the same photo, so offering them together
   only ever offers an empty grid.
*/
export type BulkEditGpsFilter = "all" | "withoutGps" | "withOverride";

const gpsFilters: KeyValuePair<BulkEditGpsFilter>[] = [
    { id: "all", name: "All Photos" },
    { id: "withoutGps", name: "Photos without GPS Data" },
    { id: "withOverride", name: "Photos with a GPS Override" }
];

interface Props {
    gpsFilter: BulkEditGpsFilter;
    onGpsFilterChange: (filter: BulkEditGpsFilter) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
}

const BulkEditFilterCard: Component<Props> = props => {
    const onSelectAll = (evt: Event) => {
        evt.preventDefault();

        props.onSelectAll();
    };

    const onDeselectAll = (evt: Event) => {
        evt.preventDefault();

        props.onDeselectAll();
    };

    return (
        <div class="mx-4">
            <div>
                <RadioGroup
                    title="Show"
                    groupName="gpsFilter"
                    itemArray={gpsFilters}
                    selectedValue={props.gpsFilter}
                    onChange={props.onGpsFilterChange}
                />
            </div>

            <div class="mt-4">
                <button class="btn btn-sm mr-2" onClick={onSelectAll}>
                    Select All
                </button>
                <button class="btn btn-sm" onClick={onDeselectAll}>
                    Deselect All
                </button>
            </div>
        </div>
    );
};

export default BulkEditFilterCard;
