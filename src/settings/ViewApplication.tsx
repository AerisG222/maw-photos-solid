import { Component } from "solid-js";

import { useAppSettings } from '../contexts/AppSettingsContext';
import { allThemes } from '../models/theme';

import ContentLayout from '../components/layout/ContentLayout';
import MainContent from '../components/layout/MainContent';
import Panel from './components/Panel';
import PanelContainer from './components/PanelContainer';
import Select from './components/Select';
import Toolbar from './Toolbar';

const ViewApplication: Component = () => {
    const [appSettings, { setTheme }] = useAppSettings();

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Application">
                <PanelContainer>
                    <Panel title="General">
                        <Select title="Theme" itemArray={allThemes} selectedValue={appSettings.theme} onChange={setTheme} />
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewApplication;
