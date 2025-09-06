import { Component } from "solid-js";

import { getNameWithShortcut } from "../shortcuts/_util";

import Icon from "../icon/Icon";
import ShortcutWrapper from "../shortcuts/ShortcutWrapper";

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

const SidebarButton: Component<Props> = props => {
    const handleClick = (data: any, evt: Event) => {
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
            <button
                disabled={props.disabled}
                class="flex px-3 py-2 hover:bg-secondary hover:text-secondary-content hover:cursor-pointer disabled:bg-transparent! disabled:text-base-content disabled:hover:cursor-not-allowed"
                classList={{
                    "bg-secondary": props.active,
                    "text-secondary-content": props.active
                }}
                title={getNameWithShortcut(props.tooltip ?? props.name, props.shortcutKeys)}
                onClick={[handleClick, null]}
            >
                <Icon classes={iconClasses()} />
            </button>
        </ShortcutWrapper>
    );
};

export default SidebarButton;
