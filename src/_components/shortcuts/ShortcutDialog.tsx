import { Component, For, createUniqueId, onCleanup, onMount } from "solid-js";

import { ShortcutInfo, useShortcutContext } from "../../_contexts/ShortcutContext";
import { createShortcut } from "@solid-primitives/keyboard";

import { isEditableTarget } from "./_util";

import Dialog from "../overlay/Dialog";
import ShortcutKey from "./ShortcutKey";

const ShortcutDialog: Component = () => {
    const [shortcutContext, { addShortcut, removeShortcut, setShowDialog }] = useShortcutContext();
    const id = createUniqueId();

    onMount(() => {
        addShortcut({
            id: id,
            shortcut: ["?"],
            description: "Show this help dialog"
        });

        // see the note in ShortcutWrapper on owning preventDefault
        createShortcut(
            ["Shift", "?"],
            event => {
                if (isEditableTarget(document.activeElement)) {
                    return;
                }

                event?.preventDefault();
                setShowDialog(true);
            },
            { preventDefault: false }
        );
    });

    onCleanup(() => {
        removeShortcut(id);
    });

    const sortShortcuts = (a: ShortcutInfo, b: ShortcutInfo) => {
        return ("" + a.shortcut[0]).localeCompare(b.shortcut[0]);
    };

    const getShortcuts = () => {
        return [...shortcutContext.shortcuts].sort(sortShortcuts);
    };

    return (
        <Dialog
            open={shortcutContext.showDialog}
            title="Active Shortcuts"
            cancelLabel="Close"
            onClose={() => setShowDialog(false)}
        >
            <div class="max-h-[400px] overflow-y-auto">
                <For each={getShortcuts()}>{shortcut => <ShortcutKey shortcut={shortcut} />}</For>
            </div>
        </Dialog>
    );
};

export default ShortcutDialog;
