import { Component } from "solid-js";

import Icon from "../icon/Icon";
import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";

const PrimaryNavCollapseButton: Component = () => {
    const [settingsState, { togglePrimaryNavCollapsed }] = useAppSettingsContext();

    const collapseIconClass = () => {
        const classes = ["text-lg", "icon-[mdi--chevron-double-left]"];

        if (settingsState.isPrimaryNavCollapsed) {
            classes.push("rotate-180");
        }

        return classes.join(" ");
    };

    return (
        <button
            class="hidden md:block py-1 text-secondary hover:text-secondary-content hover:bg-secondary cursor-pointer"
            onClick={togglePrimaryNavCollapsed}
            title="Expand/Collapse Nav"
        >
            <Icon classes={collapseIconClass()} />
        </button>
    );
};

export default PrimaryNavCollapseButton;
