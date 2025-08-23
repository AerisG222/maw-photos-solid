import { Component } from "solid-js";

import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

import Icon from "../icon/Icon";

const ToolbarCollapseButton: Component = () => {
    const [settingsState, { toggleToolbarCollapsed }] = useAppSettingsContext();

    const collapseIconClasses = () => {
        const classes = ["text-lg", "icon-[mdi--chevron-double-left]"];

        if (!settingsState.isToolbarCollapsed) {
            classes.push("rotate-180");
        }

        return classes.join(" ");
    };

    return (
        <button
            class="hidden md:block py-1 text-secondary hover:text-secondary-content hover:bg-secondary cursor-pointer"
            onClick={toggleToolbarCollapsed}
            title="Expand/Collapse Toolbar"
        >
            <Icon classes={collapseIconClasses()} />
        </button>
    );
};

export default ToolbarCollapseButton;
