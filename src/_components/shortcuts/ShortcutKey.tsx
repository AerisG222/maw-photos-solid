import { Component, For } from "solid-js";

import { ShortcutInfo } from "../../_contexts/ShortcutContext";

interface Props {
    shortcut: ShortcutInfo;
}

const ShortcutKey: Component<Props> = props => {
    const getDisplayIcon = (key: string) => {
        if (key === "arrowright") {
            return "icon-[mdi--arrow-right-thin]";
        }

        if (key === "arrowleft") {
            return "icon-[mdi--arrow-right-thin] rotate-180";
        }

        return "";
    };

    const getDisplayKey = (key: string) => {
        if (getDisplayIcon(key) !== "") {
            return "";
        }

        return key.toUpperCase();
    };

    return (
        <div class="mb-2">
            <For each={props.shortcut.shortcut}>
                {key => (
                    <kbd class={`kbd`}>
                        <span class={getDisplayIcon(key)}>{getDisplayKey(key)}</span>
                    </kbd>
                )}
            </For>

            <span class="ml-3">{props.shortcut.description}</span>
        </div>
    );
};

export default ShortcutKey;
