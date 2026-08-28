import { Component } from "solid-js";

import { getNameWithShortcut } from "../shortcuts/_util";
import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

import ShortcutWrapper from "../shortcuts/ShortcutWrapper";
import Icon from "../icon/Icon";

interface Props {
    icon: string;
    name: string;
    tooltip: string;
    active?: boolean;
    rotate90?: boolean;
    disabled?: boolean;
    shortcutKeys?: string[];
    clickHandler: () => void;
}

const ToolbarButton: Component<Props> = props => {
    const [state] = useAppSettingsContext();

    /*
       The one way this button fires. A disabled <button> ignores clicks on its
       own, but the keyboard shortcut reaches the handler directly - so without
       this, a button shown as unavailable still answers its key. That went
       unnoticed while such buttons were hidden rather than disabled.
    */
    const activate = () => {
        if (!props.disabled) {
            props.clickHandler();
        }
    };

    const handleClick = (data: null, evt: Event) => {
        evt.preventDefault();

        activate();
    };

    const iconClasses = () => {
        const classes: string[] = [];

        classes.push(props.icon);

        if (props.rotate90) {
            classes.push("rotate-90");
        }

        return classes.join(" ");
    };

    const nameClass = () => ({
        "ml-2": true,
        "text-sm": true,
        "font-bold": true,
        "align-middle": true,
        hidden: true,
        "md:inline": state.isToolbarCollapsed
    });

    return (
        <ShortcutWrapper {...props} clickHandler={activate}>
            <button
                disabled={props.disabled}
                class="flex px-3 py-2 hover:bg-secondary hover:text-secondary-content hover:cursor-pointer disabled:bg-transparent! disabled:text-base-content disabled:opacity-40 disabled:hover:cursor-not-allowed transition-colors duration-150 ease-out"
                classList={{
                    "bg-secondary": props.active,
                    "text-secondary-content": props.active
                }}
                title={getNameWithShortcut(props.tooltip ?? props.name, props.shortcutKeys)}
                onClick={[handleClick, null]}
            >
                <Icon classes={iconClasses()} />
                <span classList={nameClass()}>{props.name}</span>
            </button>
        </ShortcutWrapper>
    );
};

export default ToolbarButton;
