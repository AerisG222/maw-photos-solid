import { Component } from "solid-js";

import { useSearchPageSettingsContext } from "../_contexts/settings/SearchPageSettingsContext";
import { allCategoryViewModes } from "../_models/CategoryViewMode";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../_components/input/RadioGroup";
import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";

/*
   Only what is particular to this area - see the note in Categories. Search
   results are categories, and how a listing of them looks is answered once,
   under Browsing.
*/
const ViewSearch: Component = () => {
    const [pageSettings, { setViewMode }] = useSearchPageSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Search">
            <PanelContainer>
                <Panel title="Search Page">
                    <RadioGroup
                        title="View Mode"
                        itemArray={allCategoryViewModes}
                        groupName="pageView"
                        selectedValue={pageSettings.viewMode}
                        onChange={setViewMode}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewSearch;
