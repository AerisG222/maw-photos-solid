import { Component } from "solid-js";

import { useCategoryFilterSettingsContext } from "../contexts/settings/CategoryFilterSettingsContext";
import { useCategoryPageSettingsContext } from "../contexts/settings/CategoryPageSettingsContext";
import { useCategoryGridViewSettingsContext } from "../contexts/settings/CategoryGridViewSettingsContext";
import { useCategoryListViewSettingsContext } from "../contexts/settings/CategoryListViewSettingsContext";
import { allCategoryViewModes } from "../_models/CategoryViewMode";
import { allMargins } from "../_models/Margin";
import { allThumbnailSizes } from "../_models/ThumbnailSize";
import { categoryTypesOptions } from "../_models/CategoryTypes";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../components/input/RadioGroup";
import Toolbar from "./Toolbar";
import Toggle from "../components/input/Toggle";
import Layout from "../components/layout/Layout";

const ViewCategories: Component = () => {
    const [filterSettings, { setTypeFilter }] = useCategoryFilterSettingsContext();
    const [pageSettings, { setViewMode }] = useCategoryPageSettingsContext();
    const [gridSettings, {
        setShowTitles: setGridShowTitles,
        setMargin: setGridMargin,
        setThumbnailSize: setGridThumbnailSize
    }] = useCategoryGridViewSettingsContext();
    const [listSettings, {
        setMargin: setListMargin,
        setThumbnailSize: setListThumbnailSize
    }] = useCategoryListViewSettingsContext()

    return (
        <Layout toolbar={<Toolbar />} title="Categories">
            <PanelContainer>
                <Panel title="Category Page">
                    <RadioGroup
                        title="Type Filter"
                        itemArray={categoryTypesOptions}
                        groupName="pageTypeFilter"
                        selectedValue={filterSettings.typeFilter}
                        onChange={setTypeFilter} />
                    <RadioGroup
                        title="View"
                        itemArray={allCategoryViewModes}
                        groupName="pageView"
                        selectedValue={pageSettings.viewMode}
                        onChange={setViewMode} />
                </Panel>

                <Panel title="Grid View">
                    <Toggle
                        title="Show Titles"
                        name="gridTitles"
                        isSelected={gridSettings.showTitles}
                        onChange={setGridShowTitles} />
                    <RadioGroup
                        title="Margins"
                        groupName="gridMargins"
                        itemArray={allMargins}
                        selectedValue={gridSettings.margin}
                        onChange={setGridMargin} />
                    <RadioGroup
                        title="Thumbnail Size"
                        groupName="gridThumbnails"
                        itemArray={allThumbnailSizes}
                        selectedValue={gridSettings.thumbnailSize}
                        onChange={setGridThumbnailSize} />
                </Panel>

                <Panel title="List View">
                    <RadioGroup
                        title="Margins"
                        groupName="listMargins"
                        itemArray={allMargins}
                        selectedValue={listSettings.margin}
                        onChange={setListMargin} />
                    <RadioGroup
                        title="Thumbnail Size"
                        groupName="listThumbnails"
                        itemArray={allThumbnailSizes}
                        selectedValue={listSettings.thumbnailSize}
                        onChange={setListThumbnailSize} />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewCategories;
