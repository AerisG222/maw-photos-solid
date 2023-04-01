import { Component, For } from "solid-js";

import { useAppSettings } from '../contexts/AppSettingsContext';
import { allThemes } from '../models/theme';

import ContentLayout from '../components/layout/ContentLayout';
import MainContent from '../components/layout/MainContent';
import Toolbar from './Toolbar';
import Panel from './components/Panel';
import PanelContainer from './components/PanelContainer';
import Select from './components/Select';

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
                        <Select title="Theme" itemArray={allThemes} selectedValue={appSettings.themeId} onChange={onChangeTheme} />
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewApplication;
