import { Component } from "solid-js";

import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

import Icon from "../icon/Icon";
import Tooltip from "../tooltip/Tooltip";

const ToolbarCollapseButton: Component = () => {
    const [settingsState, { toggleToolbarLabels }] = useAppSettingsContext();

    const collapseIconClasses = () => {
        const classes = [
            "text-lg",
            "icon-[ic--round-keyboard-double-arrow-left]",
            "inline-block",
            "transition-transform",
            "duration-300",
            "ease-out"
        ];

        if (!settingsState.showToolbarLabels) {
            classes.push("rotate-180");
        }

        return classes.join(" ");
    };

    return (
        <Tooltip
            as="button"
            content="Expand/Collapse Toolbar"
            class="hidden md:block py-1 text-secondary hover:text-secondary-content hover:bg-secondary cursor-pointer transition-colors duration-150 ease-out"
            onClick={toggleToolbarLabels}
        >
            <Icon classes={collapseIconClasses()} />
        </Tooltip>
    );
};

export default ToolbarCollapseButton;
