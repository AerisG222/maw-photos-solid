import { Component, For } from "solid-js";

import { useAppSettings } from '../contexts/AppSettingsContext';
import { allThemeDetails } from '../models/theme';

import ContentLayout from '../components/layout/ContentLayout';
import MainContent from '../components/layout/MainContent';
import Toolbar from './Toolbar';
import Panel from './components/Panel';

const ViewApplication: Component = () => {
    const [appSettings, { setTheme }] = useAppSettings();

    const onChangeTheme = (evt: Event) => {
        evt.preventDefault();
        setTheme(evt.currentTarget.value);
    }

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Application">
                <Panel title="General">
                    <label class="font-bold mr-2" for="theme">Theme</label>
                    <select name="theme" onChange={onChangeTheme} value={appSettings.theme}>
                        <For each={allThemeDetails}>{ (theme) =>
                            <option value={theme.theme}>{theme.name}</option>
                        }</For>
                    </select>
                </Panel>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewApplication;
