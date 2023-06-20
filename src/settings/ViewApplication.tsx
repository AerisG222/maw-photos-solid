import { Component } from "solid-js";

import { useAppSettingsContext } from '../contexts/settings/AppSettingsContext';
import { allThemes } from '../models/Theme';

import Panel from './components/Panel';
import PanelContainer from './components/PanelContainer';
import Select from './components/Select';
import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';

const ViewApplication: Component = () => {
    const [appSettings, { setTheme }] = useAppSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Settings - Application">
            <PanelContainer>
                <Panel title="General">
                    <Select title="Theme" itemArray={allThemes} selectedValue={appSettings.theme} onChange={setTheme} />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewApplication;
