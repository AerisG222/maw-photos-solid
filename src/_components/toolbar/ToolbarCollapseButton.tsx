import { Component } from "solid-js";

import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

import Icon from "../icon/Icon";

const ToolbarCollapseButton: Component = () => {
    const [settingsState, { toggleToolbarCollapsed }] = useAppSettingsContext();

    const collapseIconClasses = () => {
        const classes = [
            "text-lg",
            "icon-[mdi--chevron-double-left]",
            "inline-block",
            "transition-transform",
            "duration-300",
            "ease-out"
        ];

        if (!settingsState.isToolbarCollapsed) {
            classes.push("rotate-180");
        }

        return classes.join(" ");
    };

    return (
        <button
            class="hidden md:block py-1 text-secondary hover:text-secondary-content hover:bg-secondary cursor-pointer transition-colors duration-150 ease-out"
            onClick={toggleToolbarCollapsed}
            title="Expand/Collapse Toolbar"
        >
            <Icon classes={collapseIconClasses()} />
        </button>
    );
};

export default ToolbarCollapseButton;
