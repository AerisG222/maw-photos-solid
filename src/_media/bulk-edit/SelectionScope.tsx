import { Component } from "solid-js";

interface Props {
    count: number;
}

// "photo" or "photos", after a count
export const photos = (count: number) => (count === 1 ? "photo" : "photos");

/*
   What a card's buttons will change, said where the buttons are.

   Every edit here applies to the whole selection at once, and the selection is
   not always all on screen - a filter can hide photos that are still chosen.
   The count beside the action is the last thing read before pressing it.
*/
const SelectionScope: Component<Props> = props => (
    <p class="text-sm mb-2" classList={{ "text-muted": props.count === 0 }}>
        {props.count === 0
            ? "Select photos to apply this to."
            : `Applies to ${props.count} selected ${photos(props.count)}.`}
    </p>
);

export default SelectionScope;
