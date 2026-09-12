import { Component } from "solid-js";

import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";
import { ThemeDark } from "../../_models/Theme";

import Icon from "../icon/Icon";

interface Props {
    showTitle: boolean;
}

const ThemeSelector: Component<Props> = props => {
    const [, { resolvedTheme, toggleTheme }] = useAppSettingsContext();

    // names the destination rather than the act, so the button is never a mystery
    const label = () =>
        resolvedTheme() === ThemeDark ? "Switch to Light Theme" : "Switch to Dark Theme";

    const nameClass = () => ({
        "ml-2": true,
        "text-lg": true,
        "font-bold": true,
        "align-middle": true,
        hidden: true,
        "md:inline": props.showTitle
    });

    return (
        <button onClick={toggleTheme} class="flex primary-nav-link cursor-pointer" title={label()}>
            <Icon classes="block icon-[ic--round-brightness-6]" />
            <span classList={nameClass()}>Theme</span>
        </button>
    );
};

export default ThemeSelector;
