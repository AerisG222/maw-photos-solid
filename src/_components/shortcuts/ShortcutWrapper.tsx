import {
    ParentComponent,
    children,
    createEffect,
    createRoot,
    createUniqueId,
    on,
    onCleanup
} from "solid-js";
import { createShortcut } from "@solid-primitives/keyboard";

import { useShortcutContext } from "../../_contexts/ShortcutContext";
import { isEditableTarget } from "./_util";

interface Props {
    name: string;
    disabled?: boolean;
    shortcutKeys?: string[];
    clickHandler: () => void;
}

const ShortcutWrapper: ParentComponent<Props> = props => {
    const c = children(() => props.children);
    const [, { addShortcut, removeShortcut }] = useShortcutContext();
    let id: string | undefined = undefined;

    const clearShortcut = () => {
        if (id) {
            removeShortcut(id);
            id = undefined;
        }
    };

    const registerShortcut = () => {
        if (id || !props.shortcutKeys) {
            return;
        }

        id = createUniqueId();

        addShortcut({
            id,
            shortcut: props.shortcutKeys,
            description: props.name
        });
    };

    /*
       Bound in an effect keyed on the keys themselves, with each binding owned by
       its own root so that replacing them disposes the previous one.

       `createShortcut` registers against whatever owner is current and is cleaned
       up with it, so calling it from the component body - as this did - read the
       keys untracked and tied the binding's life to the component. A component
       rebuilt underneath its own key (a toolbar slot read twice, say) then left
       the old binding listening, and one press acted twice.
    */
    createEffect(
        on(
            () => props.shortcutKeys,
            keys => {
                if (!keys) {
                    return;
                }

                const dispose = createRoot(dispose => {
                    /*
                       `preventDefault: false`, and done here instead.

                       The primitive cancels the keystroke *before* it calls back,
                       so declining to act was not enough: a letter bound to a
                       toolbar button was swallowed by every text field in the
                       application, which is a shortcut eating the thing it was
                       supposed to stay out of the way of. Canceling it here
                       means only a press that actually does something does so.
                    */
                    createShortcut(
                        keys,
                        event => {
                            // somebody typing into a field is not pressing a button
                            if (isEditableTarget(document.activeElement)) {
                                return;
                            }

                            // a control drawn as unavailable must not answer its key
                            if (props.disabled) {
                                return;
                            }

                            event?.preventDefault();
                            props.clickHandler();
                        },
                        { preventDefault: false }
                    );

                    return dispose;
                });

                onCleanup(dispose);
            }
        )
    );

    createEffect(() => {
        if (!props.shortcutKeys || props.disabled) {
            clearShortcut();
        } else if (!id) {
            registerShortcut();
        }
    });

    onCleanup(() => {
        clearShortcut();
    });

    return <>{c()}</>;
};

export default ShortcutWrapper;
