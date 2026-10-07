import { Component, createEffect, createSignal, For, Show } from "solid-js";

import { sameRoles } from "../access/_restriction";

import RolePicker from "../access/RolePicker";

interface Props {
    // every role there is, or undefined while they load
    roles: string[] | undefined;
    // the roles the category is granted to now, or undefined while they load
    categoryRoles: string[] | undefined;
    onSave: (roles: string[]) => void;
    isPending: boolean;
    // what the last attempt was refused for, already in words
    messages: string[];
}

/*
   Who may see this category at all - the level a photo's restriction narrows.

   Here rather than on the category's own page because this is where an admin
   already is when deciding who sees what: the photos it holds are on screen,
   and the restrictions beside it are the ones a change here has to respect.
   Unlike the cards above it, it acts on the category, not the selection.
*/
const BulkEditCategoryAccessCard: Component<Props> = props => {
    const [selected, setSelected] = createSignal<string[]>([]);

    const stored = () => props.categoryRoles ?? [];

    const reset = () => setSelected([...stored()]);

    // back to what is stored whenever that changes - on load, and after a save
    createEffect(() => {
        if (props.categoryRoles) {
            reset();
        }
    });

    const isDirty = () => !sameRoles(selected(), stored());
    const canSave = () => selected().length > 0 && isDirty() && !props.isPending;

    const save = (evt: Event) => {
        evt.preventDefault();

        props.onSave(selected());
    };

    const cancel = (evt: Event) => {
        evt.preventDefault();

        reset();
    };

    return (
        <div class="mx-4">
            <Show
                when={props.roles && props.categoryRoles}
                fallback={<p class="text-sm">Loading roles...</p>}
            >
                <p class="text-sm mb-2">
                    Shared with <strong>{stored().join(", ")}</strong>.
                </p>

                <RolePicker roles={props.roles!} selected={selected()} onChange={setSelected} />
            </Show>

            <div class="mt-4">
                <button
                    class="btn btn-sm btn-primary btn-outline mr-2"
                    classList={{ "btn-disabled": !canSave() }}
                    disabled={!canSave()}
                    onClick={save}
                >
                    Save
                </button>
                <button
                    class="btn btn-sm btn-error btn-outline"
                    disabled={!isDirty()}
                    onClick={cancel}
                >
                    Cancel
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

export default BulkEditCategoryAccessCard;
