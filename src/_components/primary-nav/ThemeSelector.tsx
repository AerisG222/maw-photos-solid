import { Component } from "solid-js";

import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";
import Icon from "../icon/Icon";

type Props = {
    showTitle: boolean;
};

const ThemeSelector: Component<Props> = props => {
    const [, { toggleTheme }] = useAppSettingsContext();

    const nameClass = () => ({
        "ml-2": true,
        "text-lg": true,
        "font-bold": true,
        "align-middle": true,
        hidden: true,
        "md:inline": props.showTitle
    });

    return (
        <button
            onClick={toggleTheme}
            class="flex primary-nav-link cursor-pointer"
            title="Toggle Theme"
        >
            <Icon classes="block icon-[mdi--theme-light-dark]" />
            <span classList={nameClass()}>Theme</span>
        </button>
    );
};

export default ThemeSelector;
