import { Component } from "solid-js";

import { useAreaSettingsContext } from "../_contexts/settings/AreaSettingsContext";
import { allCategoryViewModes } from "../_models/CategoryViewMode";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../_components/input/RadioGroup";
import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";

// see the note in Categories - search results are categories
const ViewSearch: Component = () => {
    const [area, { setSearchView }] = useAreaSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Search">
            <PanelContainer>
                <Panel title="Search Page">
                    <RadioGroup
                        title="View Mode"
                        itemArray={allCategoryViewModes}
                        groupName="pageView"
                        selectedValue={area.searchView}
                        onChange={setSearchView}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewSearch;
