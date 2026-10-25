import { Component } from "solid-js";

import { CategoryStepper } from "./BrowseListing";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    // absent until the listing has drawn - the buttons wait, disabled
    stepper: CategoryStepper | undefined;
}

/*
   A category at a time, while browsing every category's photos.

   Up and down rather than left and right: the categories run down the page,
   and left and right already mean the previous and next photograph. The keys
   are the brackets - the usual pair for a section either way, and unclaimed.
*/
const CategoryStepButtons: Component<Props> = props => (
    <>
        <ToolbarButton
            icon="icon-[ic--round-keyboard-double-arrow-up]"
            name="Previous Category"
            tooltip="Back to the start of this category, or the one before"
            shortcutKeys={["["]}
            disabled={!props.stepper?.hasPrevious()}
            clickHandler={() => props.stepper?.previous()}
        />
        <ToolbarButton
            icon="icon-[ic--round-keyboard-double-arrow-down]"
            name="Next Category"
            tooltip="On to the next category"
            shortcutKeys={["]"]}
            disabled={!props.stepper?.hasNext()}
            clickHandler={() => props.stepper?.next()}
        />
    </>
);

export default CategoryStepButtons;
