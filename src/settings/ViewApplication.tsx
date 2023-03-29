import { Component, For } from "solid-js";

import { useAppSettings } from '../contexts/AppSettingsContext';
import { allThemeDetails } from '../models/theme';

import ContentLayout from '../components/layout/ContentLayout';
import Toolbar from './Toolbar';

const ViewApplication: Component = () => {
    const [appSettings, { setTheme }] = useAppSettings();

    const onChangeTheme = (evt: Event) => {
        evt.preventDefault();
        setTheme(evt.currentTarget.value);
    }

    return (
        <ContentLayout>
            <Toolbar />
            <div class="overflow-y-auto pb-8">
                <h1 class="head1">Settings - Application</h1>

                <div class="settingsPanel">
                    <h2 class="head2">General</h2>
                    <label class="font-bold mr-2" for="theme">Theme</label>
                    <select name="theme" onChange={onChangeTheme} value={appSettings.theme}>
                        <For each={allThemeDetails}>{ (theme) =>
                            <option value={theme.theme}>{theme.name}</option>
                        }</For>
                    </select>
                </div>
            </div>
        </ContentLayout>
    );
};

export default ViewApplication;
