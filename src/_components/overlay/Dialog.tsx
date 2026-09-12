import { JSXElement, ParentComponent, Show } from "solid-js";
import { Dialog as KobalteDialog } from "@kobalte/core/dialog";

interface Props {
    open: boolean;
    title: string;
    // a sentence about what went wrong, already turned into English by the caller
    error?: string;
    /*
       The buttons that act. Cancel is provided, so this is usually the one
       confirming button - which is also why it comes last in the row.
    */
    actions?: JSXElement;
    cancelLabel?: string;
    // for a dialog holding a picker rather than a question
    wide?: boolean;
    onClose: () => void;
}

/*
   Every dialog in the application.

   Each of the five that came before this hand-rolled the same thing: a
   `<dialog class="modal">`, an effect calling `showModal()` and `close()` to
   follow a prop, and a box holding a heading, a body, an error line and a pair
   of buttons.

   The surface is styled from the app's own tokens rather than daisyUI's
   `.modal-box`, which carries `opacity: 0` and is only revealed by a rule
   requiring an open `.modal` ancestor - so borrowing it outside a native
   `<dialog>` renders a perfectly laid-out, completely invisible dialog. What they did not do consistently was the part that is
   hard - the focus trap, returning focus to whatever opened them, labelling
   themselves for a screen reader, and locking the page behind them. Kobalte
   does all of that; the markup below is only the dressing.
*/
const Dialog: ParentComponent<Props> = props => {
    return (
        <KobalteDialog
            open={props.open}
            onOpenChange={open => {
                if (!open) {
                    props.onClose();
                }
            }}
        >
            <KobalteDialog.Portal>
                <KobalteDialog.Overlay class="fixed inset-0 z-50 bg-black/50" />

                <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <KobalteDialog.Content
                        class="bg-base-100 rounded-box p-6 elev-overlay max-h-full w-full overflow-y-auto"
                        classList={{ "max-w-5xl": !!props.wide, "max-w-xl": !props.wide }}
                    >
                        <KobalteDialog.Title class="head2 mt-0">{props.title}</KobalteDialog.Title>

                        {props.children}

                        <Show when={props.error}>
                            <p class="text-sm text-error mt-2" role="alert">
                                {props.error}
                            </p>
                        </Show>

                        <div class="mt-6 flex justify-end gap-2">
                            <KobalteDialog.CloseButton class="btn btn-sm">
                                {props.cancelLabel ?? "Cancel"}
                            </KobalteDialog.CloseButton>

                            {props.actions}
                        </div>
                    </KobalteDialog.Content>
                </div>
            </KobalteDialog.Portal>
        </KobalteDialog>
    );
};

export default Dialog;
