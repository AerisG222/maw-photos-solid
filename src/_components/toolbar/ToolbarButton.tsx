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

    const nameClass = () => ({
        "ml-2": true,
        "text-sm": true,
        "font-bold": true,
        "align-middle": true,
        hidden: true,
        "md:inline": state.isToolbarCollapsed
    });

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
                <span classList={nameClass()}>{props.name}</span>
            </button>
        </ShortcutWrapper>
    );
};

export default ToolbarButton;
