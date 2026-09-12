import { Component, Show, createEffect, createSignal } from "solid-js";

import { ApiError } from "../../_contexts/api/ApiError";
import { ClanRules } from "../_clanRules";

import Dialog from "../../_components/overlay/Dialog";

interface Props {
    open: boolean;
    title: string;
    submitLabel: string;
    initialName: string;
    // how many people the clan will hold once saved, shown so a create cannot
    // silently produce an empty clan
    memberCount?: number;
    pending: boolean;
    error: unknown;
    onSubmit: (name: string) => void;
    onCancel: () => void;
}

/*
   Names a clan, on create and on rename alike - the two differ only in their
   labels and starting value, and a second component would have been the same
   markup with a different heading.
*/
const ClanNameDialog: Component<Props> = props => {
    const [name, setName] = createSignal(props.initialName);

    let input: HTMLInputElement | undefined;

    createEffect(() => {
        if (props.open) {
            setName(props.initialName);
            // the dialog takes focus to itself on open; put it in the field
            queueMicrotask(() => input?.focus());
        }
    });

    const trimmed = () => name().trim();
    const canSubmit = () =>
        !props.pending && trimmed().length > 0 && trimmed().length <= ClanRules.maxNameLength;

    const submit = () => {
        if (canSubmit()) {
            props.onSubmit(trimmed());
        }
    };

    /*
       Mapped from the status rather than the response body, which the api layer
       does not carry. Both of these are answers about what the user typed, so
       they are worth saying precisely instead of "something went wrong".
    */
    const errorMessage = () => {
        const error = props.error;

        if (!error) {
            return undefined;
        }

        if (error instanceof ApiError) {
            if (error.status === 409) {
                return "You already have a clan with that name.";
            }

            if (error.status === 400) {
                return "That clan could not be saved - check the name and try again.";
            }
        }

        return "The clan could not be saved. Please try again.";
    };

    return (
        <Dialog
            open={props.open}
            title={props.title}
            error={errorMessage()}
            onClose={props.onCancel}
            actions={
                <button class="btn btn-sm btn-primary" disabled={!canSubmit()} onClick={submit}>
                    {props.submitLabel}
                </button>
            }
        >
            <input
                ref={input}
                type="text"
                class="input input-bordered w-full"
                placeholder="Clan Name"
                maxLength={ClanRules.maxNameLength}
                value={name()}
                onInput={evt => setName(evt.currentTarget.value)}
                onKeyDown={evt => {
                    if (evt.key === "Enter") {
                        submit();
                    }
                }}
            />

            <Show when={props.memberCount !== undefined}>
                <p class="text-sm mt-2">
                    {props.memberCount === 1
                        ? "1 person selected"
                        : `${props.memberCount ?? 0} people selected`}
                </p>
            </Show>
        </Dialog>
    );
};

export default ClanNameDialog;
