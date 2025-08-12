import { Component } from "solid-js";

import ShortcutWrapper from './ShortcutWrapper';
import { getNameWithShortcut } from './_util';

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
    const handleClick = (data: any, evt: Event) => {
        evt.preventDefault();

        props.clickHandler();
    };

    return (
        <ShortcutWrapper {...props}>
            <button
                disabled={props.disabled}
                class="px-3 py-1 hover:bg-secondary hover:text-secondary-content disabled:bg-transparent! disabled:color-base-content:20%"
                classList={{"bg-secondary-focus": props.active, "text-secondary-content": props.active}}
                title={getNameWithShortcut(props.name, props.shortcutKeys)}
                onClick={[handleClick, null]}
            >
                <span class={`text-lg ${props.icon}`} classList={{"rotate-90": props.rotate90}} />
            </button>
        </ShortcutWrapper>
    );
};

export default ToolbarButton;
