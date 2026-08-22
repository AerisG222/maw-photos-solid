import { Component, Show, createEffect, createSignal } from "solid-js";

import { ApiError } from "../../_contexts/api/ApiError";
import { ClanRules } from "../_clanRules";

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
    const [dialog, setDialog] = createSignal<HTMLDialogElement>();
    const [name, setName] = createSignal(props.initialName);

    let input: HTMLInputElement | undefined;

    createEffect(() => {
        if (props.open) {
            setName(props.initialName);
            dialog()?.showModal();
            input?.focus();
        } else {
            dialog()?.close();
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
        <dialog class="modal" ref={setDialog} onClose={() => props.onCancel()}>
            <div class="modal-box">
                <h3 class="font-bold text-lg mb-4 text-secondary">{props.title}</h3>

                <input
                    ref={input}
                    type="text"
                    class="input input-bordered w-full"
                    placeholder="Clan Name"
                    maxLength={ClanRules.maxNameLength}
                    value={name()}
                    onInput={evt => setName(evt.currentTarget.value)}
                    onKeyDown={evt => {
                        // the page listens for single key shortcuts, which would
                        // otherwise fire for every letter typed here
                        evt.stopPropagation();

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

                <Show when={errorMessage()}>
                    <p class="text-sm text-error mt-2">{errorMessage()}</p>
                </Show>

                <div class="modal-action">
                    <button class="btn btn-sm" onClick={() => props.onCancel()}>
                        Cancel
                    </button>
                    <button class="btn btn-sm btn-primary" disabled={!canSubmit()} onClick={submit}>
                        {props.submitLabel}
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default ClanNameDialog;
