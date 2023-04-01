import { Component, For } from "solid-js";

import { useAppSettings } from '../contexts/AppSettingsContext';
import { allThemes } from '../models/theme';

import ContentLayout from '../components/layout/ContentLayout';
import MainContent from '../components/layout/MainContent';
import Toolbar from './Toolbar';
import Panel from './components/Panel';
import PanelContainer from './components/PanelContainer';

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
                <PanelContainer>
                    <Panel title="General">
                        <div class="form-control max-w-16rem">
                            <label class="label">
                                <span class="label-text">Theme</span>
                            </label>
                            <select name="theme" class="select select-sm select-bordered min-w-12rem" onChange={onChangeTheme} value={appSettings.theme}>
                                <For each={allThemes}>{ (theme) =>
                                    <option value={theme.id}>{theme.name}</option>
                                }</For>
                            </select>
                        </div>
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewApplication;
