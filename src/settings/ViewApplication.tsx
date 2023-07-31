import { Component } from "solid-js";

import { useAppSettingsContext } from '../contexts/settings/AppSettingsContext';
import { allThemes } from '../_models/Theme';

import Panel from './components/Panel';
import PanelContainer from './components/PanelContainer';
import Select from '../components/input/Select';
import Toolbar from './Toolbar';
import Layout from '../components/layout/Layout';

const ViewApplication: Component = () => {
    const [appSettings, { setTheme }] = useAppSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Application">
            <PanelContainer>
                <Panel title="General">
                    <Select title="Theme" itemArray={allThemes} selectedValue={appSettings.theme} onChange={setTheme} />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewApplication;
