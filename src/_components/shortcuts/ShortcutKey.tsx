import { Component, For } from "solid-js";

import { ShortcutInfo } from "../../_contexts/ShortcutContext";

interface Props {
    shortcut: ShortcutInfo;
}

const ShortcutKey: Component<Props> = props => {
    const getDisplayIcon = (key: string) => {
        if (key === "arrowright") {
            return "i-ic:round-arrow-right-alt";
        }

        if (key === "arrowleft") {
            return "i-ic:round-arrow-right-alt rotate-180";
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

            <span> - </span>

            <span>{props.shortcut.description}</span>
        </div>
    );
};

export default ShortcutKey;
