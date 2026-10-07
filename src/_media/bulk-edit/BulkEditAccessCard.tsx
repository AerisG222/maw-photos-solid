import { Component, createSignal, For, Show } from "solid-js";

import { AdminRole } from "../access/_restriction";

import RolePicker from "../access/RolePicker";

interface Props {
    // every role there is, or undefined while they load
    roles: string[] | undefined;
    onRestrict: (roles: string[]) => void;
    onClearRestriction: () => void;
    // how many photos either would touch - nothing selected, nothing to change
    selectedCount: number;
    isPending: boolean;
    // what the last attempt was refused for, already in words
    messages: string[];
}

/*
   Restricting a selection - the GPS card's counterpart for who may see them.

   The roles start with admin ticked, for the reason the inspector's card gives:
   the first thing a restriction should not do is hide the photos from the
   person setting it. Leaving it off is still allowed, and asked about.
*/
const BulkEditAccessCard: Component<Props> = props => {
    const [selected, setSelected] = createSignal<string[]>([AdminRole]);

    const canRestrict = () => props.selectedCount > 0 && selected().length > 0 && !props.isPending;

    const restrict = (evt: Event) => {
        evt.preventDefault();

        props.onRestrict(selected());
    };

    const clearRestriction = (evt: Event) => {
        evt.preventDefault();

        props.onClearRestriction();
    };

    return (
        <div class="mx-4">
            <Show when={props.roles} fallback={<p class="text-sm">Loading roles...</p>}>
                <RolePicker roles={props.roles!} selected={selected()} onChange={setSelected} />
            </Show>

            <div class="mt-4">
                <button
                    class="btn btn-sm btn-primary btn-outline mr-2"
                    classList={{ "btn-disabled": !canRestrict() }}
                    disabled={!canRestrict()}
                    onClick={restrict}
                >
                    Restrict
                </button>
                <button
                    class="btn btn-sm btn-error btn-outline"
                    classList={{ "btn-disabled": props.selectedCount === 0 }}
                    disabled={props.selectedCount === 0 || props.isPending}
                    onClick={clearRestriction}
                >
                    Unrestrict
                </button>
            </div>

            <Show when={props.messages.length > 0}>
                <ul class="text-sm text-error mt-2">
                    <For each={props.messages}>{message => <li>{message}</li>}</For>
                </ul>
            </Show>
        </div>
    );
};

export default BulkEditAccessCard;
