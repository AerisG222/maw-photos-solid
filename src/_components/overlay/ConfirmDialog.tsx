import { ParentComponent, Show } from "solid-js";
import { AlertDialog } from "@kobalte/core/alert-dialog";

interface Props {
    open: boolean;
    title: string;
    confirmLabel: string;
    // a deletion, rather than a save - colors the confirming button
    destructive?: boolean;
    pending?: boolean;
    error?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

/*
   Asking before doing something that cannot be taken back.

   An alert dialog rather than a plain one, which is not only a different
   color of button: it takes focus to itself on open and will not be dismissed
   by a click outside, because an accidental dismissal of "are you sure" should
   not be indistinguishable from answering it.
*/
const ConfirmDialog: ParentComponent<Props> = props => {
    return (
        <AlertDialog
            open={props.open}
            onOpenChange={open => {
                if (!open) {
                    props.onCancel();
                }
            }}
        >
            <AlertDialog.Portal>
                <AlertDialog.Overlay class="fixed inset-0 z-50 bg-black/50" />

                <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <AlertDialog.Content class="bg-base-100 rounded-box p-6 elev-overlay w-full max-w-md">
                        <AlertDialog.Title class="head2 mt-0">{props.title}</AlertDialog.Title>

                        <AlertDialog.Description>{props.children}</AlertDialog.Description>

                        <Show when={props.error}>
                            <p class="text-sm text-error mt-2" role="alert">
                                {props.error}
                            </p>
                        </Show>

                        <div class="mt-6 flex justify-end gap-2">
                            <AlertDialog.CloseButton class="btn btn-sm">
                                Cancel
                            </AlertDialog.CloseButton>

                            <button
                                class="btn btn-sm"
                                classList={{
                                    "btn-error": !!props.destructive,
                                    "btn-primary": !props.destructive
                                }}
                                disabled={props.pending}
                                onClick={() => props.onConfirm()}
                            >
                                {props.confirmLabel}
                            </button>
                        </div>
                    </AlertDialog.Content>
                </div>
            </AlertDialog.Portal>
        </AlertDialog>
    );
};

export default ConfirmDialog;
