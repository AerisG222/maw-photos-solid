import { Component } from "solid-js";

import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

import ShortcutWrapper from "../shortcuts/ShortcutWrapper";
import Icon from "../icon/Icon";
import Tooltip from "../tooltip/Tooltip";

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

    const handleClick = (evt: MouseEvent) => {
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
        "md:inline": state.showToolbarLabels
    });

    return (
        <ShortcutWrapper {...props} clickHandler={activate}>
            <Tooltip
                as="button"
                content={props.tooltip ?? props.name}
                shortcutKeys={props.shortcutKeys}
                disabled={props.disabled}
                class="flex px-3 py-2 hover:bg-secondary hover:text-secondary-content hover:cursor-pointer disabled:bg-transparent! disabled:text-base-content disabled:opacity-40 disabled:hover:cursor-not-allowed transition-colors duration-150 ease-out"
                classList={{
                    "bg-secondary": props.active,
                    "text-secondary-content": props.active
                }}
                /*
                   Named and stated, not just tooltipped. The span below is
                   `hidden` until `md` *and* until labels are turned on, so for
                   most readers this is an icon and a tooltip - which is
                   invisible on touch and not the accessible name.

                   `active` on a toolbar button always means "this is switched
                   on", so it is a pressed state rather than a selected one.
                */
                aria-label={props.name}
                aria-pressed={props.active}
                onClick={handleClick}
            >
                <Icon classes={iconClasses()} />
                <span classList={nameClass()}>{props.name}</span>
            </Tooltip>
        </ShortcutWrapper>
    );
};

export default ToolbarButton;
