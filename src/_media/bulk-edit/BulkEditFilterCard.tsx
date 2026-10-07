import { Component, Show } from "solid-js";

import { KeyValuePair } from "../../_models/KeyValuePair";

import RadioGroup from "../../_components/input/RadioGroup";

/*
   One choice rather than a checkbox per filter: "without gps" and "with an
   override" cannot both hold for the same photo, so offering them together
   only ever offers an empty grid. Restricted photos join them as a choice of
   their own - each filter here is the set of photos one card works on, and the
   restricted ones include photos the gps filters cannot see at all.
*/
export type BulkEditFilter = "all" | "withoutGps" | "withOverride" | "restricted";

const filters: KeyValuePair<BulkEditFilter>[] = [
    { id: "all", name: "All Photos" },
    { id: "withoutGps", name: "Photos without GPS Data" },
    { id: "withOverride", name: "Photos with a GPS Override" },
    { id: "restricted", name: "Restricted Photos" }
];

interface Props {
    filter: BulkEditFilter;
    onFilterChange: (filter: BulkEditFilter) => void;
    // restricted photos in this category that the admin cannot see themselves
    hiddenCount: number;
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
                    groupName="bulkEditFilter"
                    itemArray={filters}
                    selectedValue={props.filter}
                    onChange={props.onFilterChange}
                />
            </div>

            {/* otherwise nothing on screen says they exist */}
            <Show when={props.hiddenCount > 0 && props.filter !== "restricted"}>
                <p class="text-sm text-warning mt-2">
                    {props.hiddenCount} restricted{" "}
                    {props.hiddenCount === 1 ? "photo here is" : "photos here are"} hidden from you.
                    Show Restricted Photos to manage {props.hiddenCount === 1 ? "it" : "them"}.
                </p>
            </Show>

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
