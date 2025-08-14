import { ParentComponent, children, createEffect, createUniqueId, onCleanup } from "solid-js";
import { createShortcut } from "@solid-primitives/keyboard";

import { useShortcutContext } from "../../contexts/ShortcutContext";

type Props = {
    name: string;
    disabled?: boolean;
    shortcutKeys?: string[];
    clickHandler: () => void;
};

const ShortcutWrapper: ParentComponent<Props> = props => {
    const c = children(() => props.children);
    const [, { addShortcut, removeShortcut }] = useShortcutContext();
    let id = undefined;

    const clearShortcut = () => {
        if (id) {
            removeShortcut(id);
            id = undefined;
        }
    };

    const registerShortcut = () => {
        if (id) {
            return;
        }

        id = createUniqueId();

        // createShortcut(props.shortcutKeys, () => { props.clickHandler() });

        addShortcut({
            id,
            shortcut: props.shortcutKeys,
            description: props.name
        });
    };

    // todo: not sure why, but this is unhappy if it runs in createEffect,
    // so we are leaving this here for now...
    if (props.shortcutKeys) {
        createShortcut(props.shortcutKeys, () => props.clickHandler());
    }

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
