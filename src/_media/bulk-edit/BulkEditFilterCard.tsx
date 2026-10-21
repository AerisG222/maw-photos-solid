import { Component, Show } from "solid-js";

import { KeyValuePair } from "../../_models/KeyValuePair";

import Icon from "../../_components/icon/Icon";
import RadioGroup from "../../_components/input/RadioGroup";
import { photos } from "./SelectionScope";

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
    // every selected photo, and how many of those the filter is hiding
    selectedCount: number;
    selectedNotShownCount: number;
    // step to the photo either side without a location - see _missingGps
    onPreviousMissingGps: () => void;
    onNextMissingGps: () => void;
    hasPreviousMissingGps: boolean;
    hasNextMissingGps: boolean;
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

            <p class="text-sm mt-4">
                <span class="font-bold">{props.selectedCount}</span> {photos(props.selectedCount)}{" "}
                selected
            </p>

            {/*
                Still selected, and still changed by the next edit, but nowhere
                on screen - a filter changed under them, or a refetch moved them
                out of it, as setting a location does under "without GPS".
            */}
            <Show when={props.selectedNotShownCount > 0}>
                <p class="text-sm text-warning">
                    {props.selectedNotShownCount} of them{" "}
                    {props.selectedNotShownCount === 1 ? "is" : "are"} not shown by this filter.
                </p>
            </Show>

            <div class="mt-2">
                <button class="btn btn-sm mr-2" onClick={onSelectAll}>
                    Select All
                </button>
                <button class="btn btn-sm" onClick={onDeselectAll}>
                    Deselect All
                </button>
            </div>

            <div class="mt-4 flex items-center gap-2">
                <span class="text-sm">Missing GPS</span>
                <button
                    class="btn btn-sm"
                    disabled={!props.hasPreviousMissingGps}
                    onClick={() => props.onPreviousMissingGps()}
                >
                    <Icon classes="icon-[ic--round-chevron-left] text-lg" />
                    Previous
                </button>
                <button
                    class="btn btn-sm"
                    disabled={!props.hasNextMissingGps}
                    onClick={() => props.onNextMissingGps()}
                >
                    Next
                    <Icon classes="icon-[ic--round-chevron-right] text-lg" />
                </button>
            </div>
        </div>
    );
};

export default BulkEditFilterCard;
