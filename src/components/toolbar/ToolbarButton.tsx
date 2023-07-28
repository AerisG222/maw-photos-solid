import { createShortcut } from '@solid-primitives/keyboard';
import { Component, createUniqueId, onCleanup } from "solid-js";
import { useShortcutContext } from '../../contexts/ShortcutContext';

type Props = {
    icon: string;
    name: string;
    active?: boolean;
    rotate90?: boolean;
    disabled?: boolean;
    shortcutKeys?: string[];
    clickHandler: () => void;
};

const ToolbarButton: Component<Props> = (props) => {
    const [, { addShortcut, removeShortcut }] = useShortcutContext();
    let id = undefined;

    const handleClick = (data: any, evt: Event) => {
        evt.preventDefault();

        props.clickHandler();
    };

    if(props.shortcutKeys) {
        createShortcut(props.shortcutKeys, () => { props.clickHandler() });

        id = createUniqueId();

        addShortcut({
            id,
            shortcut: props.shortcutKeys,
            description: props.name
        });
    }

    onCleanup(() => {
        removeShortcut(id);
    });

    return (
        <button
            disabled={props.disabled}
            class="px-3 py-1 hover:bg-accent hover:color-accentContent disabled:bg-transparent! disabled:color-secondary-content disabled:opacity-20"
            classList={{"bg-accent": props.active, "color-accentContent": props.active}}
            title={props.name}
            onClick={[handleClick, null]}
        >
            <span class={`text-6 ${props.icon}`} classList={{"rotate-90": props.rotate90}} />
        </button>
    );
};

export default ToolbarButton;
