import { Component } from "solid-js";

import Icon from "../icon/Icon";
import Tooltip from "../tooltip/Tooltip";
import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

const PrimaryNavCollapseButton: Component = () => {
    const [settingsState, { toggleNavExpanded }] = useAppSettingsContext();

    const collapseIconClass = () => {
        const classes = [
            "text-lg",
            "icon-[ic--round-keyboard-double-arrow-left]",
            "inline-block",
            "transition-transform",
            "duration-300",
            "ease-out"
        ];

        if (!settingsState.navExpanded) {
            classes.push("rotate-180");
        }

        return classes.join(" ");
    };

    return (
        <Tooltip
            as="button"
            content="Expand/Collapse Nav"
            class="hidden md:block py-1 text-secondary hover:text-secondary-content hover:bg-secondary cursor-pointer transition-colors duration-150 ease-out"
            onClick={toggleNavExpanded}
        >
            <Icon classes={collapseIconClass()} />
        </Tooltip>
    );
};

export default PrimaryNavCollapseButton;
