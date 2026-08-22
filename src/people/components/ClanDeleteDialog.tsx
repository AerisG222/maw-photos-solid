import { Component, Show, createEffect, createSignal } from "solid-js";

import { Clan } from "../../_models/Clan";

interface Props {
    clan: Clan | undefined;
    pending: boolean;
    error: unknown;
    onConfirm: () => void;
    onCancel: () => void;
}

const ClanDeleteDialog: Component<Props> = props => {
    const [dialog, setDialog] = createSignal<HTMLDialogElement>();

    createEffect(() => {
        if (props.clan) {
            dialog()?.showModal();
        } else {
            dialog()?.close();
        }
    });

    return (
        <dialog class="modal" ref={setDialog} onClose={() => props.onCancel()}>
            <div class="modal-box">
                <h3 class="font-bold text-lg mb-4 text-secondary">Delete Clan</h3>

                <p>
                    Delete <span class="font-bold">{props.clan?.name}</span>? The people in it are
                    left alone - only the grouping goes away.
                </p>

                <Show when={props.error}>
                    <p class="text-sm text-error mt-2">
                        The clan could not be deleted. Please try again.
                    </p>
                </Show>

                <div class="modal-action">
                    <button class="btn btn-sm" onClick={() => props.onCancel()}>
                        Cancel
                    </button>
                    <button
                        class="btn btn-sm btn-error"
                        disabled={props.pending}
                        onClick={() => props.onConfirm()}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default ClanDeleteDialog;
