import { Component, Show } from "solid-js";

import { ClanRules } from "../_clanRules";

import Icon from "../../_components/icon/Icon";

interface Props {
    // what the selection is for, e.g. "New clan" or "Members of the kids"
    title: string;
    selectedCount: number;
    submitLabel: string;
    // an empty selection is a real answer when editing - it is how the last
    // member is removed - but creating an empty clan is not worth allowing
    canSubmit: boolean;
    pending: boolean;
    onSubmit: () => void;
    onClear: () => void;
    onCancel: () => void;
}

/*
   Pinned while people are being picked, so the count and the way out stay in
   reach however far down the face grid the user has scrolled.
*/
const SelectionBar: Component<Props> = props => {
    const overLimit = () => props.selectedCount > ClanRules.maxMembers;

    return (
        <div class="sticky top-0 z-20 chrome-glass border-b-1 border-base-content/20 py-2 px-3 mb-2">
            <div class="flex flex-row flex-wrap items-center justify-center gap-3">
                <span class="font-bold">{props.title}</span>

                <span class="text-sm opacity-70">
                    {props.selectedCount === 1 ? "1 selected" : `${props.selectedCount} selected`}
                </span>

                <button
                    class="btn btn-sm btn-primary"
                    disabled={!props.canSubmit || props.pending || overLimit()}
                    onClick={() => props.onSubmit()}
                >
                    <Icon classes="icon-[ic--round-check]" />
                    {props.submitLabel}
                </button>

                <button
                    class="btn btn-sm btn-outline"
                    disabled={props.selectedCount === 0}
                    onClick={() => props.onClear()}
                >
                    Clear
                </button>

                <button class="btn btn-sm btn-outline" onClick={() => props.onCancel()}>
                    Cancel
                </button>
            </div>

            <Show when={overLimit()}>
                <p class="text-sm text-error text-center mt-1">
                    A clan may hold at most {ClanRules.maxMembers} people.
                </p>
            </Show>
        </div>
    );
};

export default SelectionBar;
