import { Component } from "solid-js";

import { useAppSettingsContext } from "../_contexts/settings/AppSettingsContext";
import { allThemes, ThemeIdType } from "../_models/Theme";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../_components/input/RadioGroup";
import Toggle from "../_components/input/Toggle";
import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";

/*
   How the application itself looks, as opposed to how it presents a listing.

   The theme lives here as well as in the navigation because the two controls
   answer different questions. The button up there flips between light and dark -
   whatever you are looking at, to the other one. Following the operating system
   is a third answer that cannot be reached by flipping, because it renders as
   one of the other two and a cycle through it appears to do nothing every third
   press.
*/
const ViewAppearance: Component = () => {
    const [settings, { setTheme, setNavExpanded, setShowToolbarLabels }] = useAppSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Appearance">
            <PanelContainer>
                <Panel title="Theme">
                    <RadioGroup
                        title="Theme"
                        groupName="theme"
                        itemArray={allThemes}
                        selectedValue={settings.theme}
                        onChange={(value: ThemeIdType) => setTheme(value)}
                    />
                </Panel>

                <Panel title="Chrome">
                    <Toggle
                        title="Expand Navigation"
                        name="navExpanded"
                        isSelected={settings.navExpanded}
                        onChange={setNavExpanded}
                    />
                    <Toggle
                        title="Show Toolbar Labels"
                        name="showToolbarLabels"
                        isSelected={settings.showToolbarLabels}
                        onChange={setShowToolbarLabels}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewAppearance;
