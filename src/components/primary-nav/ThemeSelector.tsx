import { Component } from "solid-js";

import {
    useAppSettingsContext,
} from "../../contexts/settings/AppSettingsContext";

const ThemeSelector: Component = () => {
    const [, { toggleTheme }] = useAppSettingsContext();

    return (
        <button
            onClick={toggleTheme}
            class="flex primary-nav-link cursor-pointer" title="Toggle Theme"
        >
            <span class="block icon-[mdi--theme-light-dark]"></span>
            {/* <span style="@titleStyle" class="hidden md:block font-bold text-lg ml-3 maw-primary-nav-title">Theme</span> */}
        </button>
    );
};

export default ThemeSelector;
