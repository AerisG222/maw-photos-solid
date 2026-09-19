import { Component, Show } from "solid-js";

import Icon from "../icon/Icon";
import Tooltip from "../tooltip/Tooltip";
import ShortcutWrapper from "../shortcuts/ShortcutWrapper";

interface Props {
    icon: string;
    name: string;
    tooltip: string;
    active?: boolean;
    /*
       Show the name beside the icon. The rail is a narrow strip and has room
       for neither, but where these are offered as a row inside the panel there
       is width for the word - and eight unlabeled icons is not a menu anybody
       can read.
    */
    withLabel?: boolean;
    rotate90?: boolean;
    disabled?: boolean;
    shortcutKeys?: string[];
    clickHandler: () => void;
}

const SidebarButton: Component<Props> = props => {
    const handleClick = (evt: MouseEvent) => {
        evt.preventDefault();

        props.clickHandler();
    };

    const iconClasses = () => {
        const classes: string[] = [];

        classes.push(props.icon);

        if (props.rotate90) {
            classes.push("rotate-90");
        }

        return classes.join(" ");
    };

    return (
        <ShortcutWrapper {...props}>
            <Tooltip
                as="button"
                content={props.tooltip ?? props.name}
                shortcutKeys={props.shortcutKeys}
                disabled={props.disabled}
                class="flex px-3 py-2 hover:bg-secondary hover:text-secondary-content hover:cursor-pointer disabled:bg-transparent! disabled:text-base-content disabled:opacity-40 disabled:hover:cursor-not-allowed transition-colors duration-150 ease-out"
                classList={{
                    "bg-secondary": props.active,
                    "text-secondary-content": props.active,
                    "gap-2 whitespace-nowrap": props.withLabel
                }}
                aria-label={props.name}
                aria-pressed={props.active}
                onClick={handleClick}
            >
                <Icon classes={iconClasses()} />

                <Show when={props.withLabel}>
                    <span class="text-label">{props.name}</span>
                </Show>
            </Tooltip>
        </ShortcutWrapper>
    );
};

export default SidebarButton;
