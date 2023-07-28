import { Component, For, createEffect, createSignal, createUniqueId, onCleanup, onMount } from 'solid-js';

import { useShortcutContext } from '../../contexts/ShortcutContext';
import { createShortcut } from '@solid-primitives/keyboard';

import ShortcutKey from './ShortcutKey';

const ShortcutDialog: Component = () => {
    const [dialog, setDialog] = createSignal<HTMLDialogElement>();
    const [shortcutContext, { addShortcut, removeShortcut, setShowDialog }] = useShortcutContext();
    const id = createUniqueId();

    createEffect(() => {
        if(shortcutContext.showDialog) {
            dialog().showModal();
        } else {
            dialog().close();
        }
    });

    onMount(() => {
        dialog().onclose = () => setShowDialog(false);

        addShortcut({
            id: id,
            shortcut: ["?"],
            description: 'Show this help dialog'
        });

        createShortcut(["Shift", "?"], () => { setShowDialog(true); });
    });

    onCleanup(() => {
        removeShortcut(id);
    });

    return (
        <dialog class="modal" ref={setDialog}>
            <form method="dialog" class="modal-box">
                <h3 class="font-bold text-lg mb-4">Active Shortcuts</h3>

                <div class="max-h-[400px] overflow-y-scroll">
                    <For each={shortcutContext.shortcuts}>{shortcut =>
                        <ShortcutKey shortcut={shortcut} />
                    }</For>
                </div>

                <div class="modal-action">
                    <button class="btn btn-sm" onClick={() => setShowDialog(false)}>Close</button>
                </div>
            </form>
        </dialog>
    );
};

export default ShortcutDialog;
