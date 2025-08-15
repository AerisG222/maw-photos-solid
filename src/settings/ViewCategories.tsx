import { Component, batch } from "solid-js";

import { useCategoryPageSettingsContext } from "../_contexts/settings/CategoryPageSettingsContext";
import { useCategoryGridViewSettingsContext } from "../_contexts/settings/CategoryGridViewSettingsContext";
import { useCategoryListViewSettingsContext } from "../_contexts/settings/CategoryListViewSettingsContext";
import { allCategoryViewModes } from "../_models/CategoryViewMode";
import { allMargins } from "../_models/Margin";
import {
    ThumbnailSizeDefault,
    ThumbnailSizeIdType,
    allThumbnailSizes
} from "../_models/ThumbnailSize";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../_components/input/RadioGroup";
import Toolbar from "./Toolbar";
import Toggle from "../_components/input/Toggle";
import Layout from "../_components/layout/Layout";

const ViewCategories: Component = () => {
    const [pageSettings, { setViewMode }] = useCategoryPageSettingsContext();
    const [
        gridSettings,
        {
            setShowTitles: setGridShowTitles,
            setMargin: setGridMargin,
            setThumbnailSize: setGridThumbnailSize
        }
    ] = useCategoryGridViewSettingsContext();
    const [listSettings, { setMargin: setListMargin, setThumbnailSize: setListThumbnailSize }] =
        useCategoryListViewSettingsContext();

    const gridSetShowTitles = (doShow: boolean) => {
        batch(() => {
            setGridShowTitles(doShow);

            if (doShow) {
                setGridThumbnailSize(ThumbnailSizeDefault);
            }
        });
    };

    const gridSetThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => {
        batch(() => {
            setGridThumbnailSize(thumbnailSize);

            if (thumbnailSize !== ThumbnailSizeDefault) {
                setGridShowTitles(false);
            }
        });
    };

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

                <Panel title="Grid View">
                    <Toggle
                        title="Show Titles"
                        name="gridTitles"
                        isSelected={gridSettings.showTitles}
                        onChange={gridSetShowTitles}
                    />
                    <RadioGroup
                        title="Margins"
                        groupName="gridMargins"
                        itemArray={allMargins}
                        selectedValue={gridSettings.margin}
                        onChange={setGridMargin}
                    />
                    <RadioGroup
                        title="Thumbnail Size"
                        groupName="gridThumbnails"
                        itemArray={allThumbnailSizes}
                        selectedValue={gridSettings.thumbnailSize}
                        onChange={gridSetThumbnailSize}
                    />
                </Panel>

                <Panel title="List View">
                    <RadioGroup
                        title="Margins"
                        groupName="listMargins"
                        itemArray={allMargins}
                        selectedValue={listSettings.margin}
                        onChange={setListMargin}
                    />
                    <RadioGroup
                        title="Thumbnail Size"
                        groupName="listThumbnails"
                        itemArray={allThumbnailSizes}
                        selectedValue={listSettings.thumbnailSize}
                        onChange={setListThumbnailSize}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewCategories;
