import { Component } from "solid-js";

import { useCategoryPageSettingsContext } from "../_contexts/settings/CategoryPageSettingsContext";
import { allCategoryViewModes } from "../_models/CategoryViewMode";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../_components/input/RadioGroup";
import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";

/*
   Only what is particular to this area. How its grid and list present their
   items is the same question every other listing in the application asks, and
   is answered once, under Browsing.
*/
const ViewCategories: Component = () => {
    const [pageSettings, { setViewMode }] = useCategoryPageSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="Categories">
            <PanelContainer>
                <Panel title="Category Page">
                    <RadioGroup
                        title="View"
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

export default ViewCategories;
