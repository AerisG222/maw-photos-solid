import { Component, batch } from "solid-js";

import { useSearchPageSettingsContext } from "../contexts/settings/SearchPageSettingsContext";
import { useSearchGridViewSettingsContext } from "../contexts/settings/SearchGridViewSettingsContext";
import { useSearchListViewSettingsContext } from "../contexts/settings/SearchListViewSettingsContext";
import { ThumbnailSizeDefault, ThumbnailSizeIdType, allThumbnailSizes } from "../_models/ThumbnailSize";
import { allMargins } from "../_models/Margin";
import { allCategoryViewModes } from "../_models/CategoryViewMode";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../components/input/RadioGroup";
import Toolbar from "./Toolbar";
import Toggle from "../components/input/Toggle";
import Layout from "../components/layout/Layout";

const ViewSearch: Component = () => {
    const [pageSettings, { setViewMode }] = useSearchPageSettingsContext();
    const [listSettings, { setMargin: setListMargin, setThumbnailSize: setListThumbnailSize }] = useSearchListViewSettingsContext();
    const [gridSettings, {
        setShowTitles: setGridShowTitles,
        setShowYears: setGridShowYears,
        setMargin: setGridMargin,
        setThumbnailSize: setGridThumbnailSize
    }] = useSearchGridViewSettingsContext();

    const gridSetShowTitles = (doShow: boolean) => {
        batch(() => {
            setGridShowTitles(doShow);

            if(doShow) {
                setGridThumbnailSize(ThumbnailSizeDefault);
            }
        });
    };

    const gridSetShowYears = (doShow: boolean) => {
        batch(() => {
            setGridShowYears(doShow);

            if(doShow) {
                setGridThumbnailSize(ThumbnailSizeDefault);
            }
        });
    };

    const gridSetThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => {
        batch(() => {
            setGridThumbnailSize(thumbnailSize);

            if(thumbnailSize !== ThumbnailSizeDefault) {
                setGridShowTitles(false);
                setGridShowYears(false);
            }
        });
    };

    return (
        <Layout toolbar={<Toolbar />} title="Search">
            <PanelContainer>
                <Panel title="Search Page">
                    <RadioGroup
                        title="View Mode"
                        groupName="pageViewMode"
                        itemArray={allCategoryViewModes}
                        selectedValue={pageSettings.viewMode}
                        onChange={setViewMode} />
                </Panel>

                <Panel title="Grid View">
                    <Toggle
                        title="Show Category Titles"
                        name="gridShowTitles"
                        isSelected={gridSettings.showTitles}
                        onChange={gridSetShowTitles} />
                    <Toggle
                        title="Show Category Years"
                        name="gridShowYears"
                        isSelected={gridSettings.showYears}
                        onChange={gridSetShowYears} />
                    <RadioGroup
                        title="Margins"
                        groupName="gridMargin"
                        itemArray={allMargins}
                        selectedValue={gridSettings.margin}
                        onChange={setGridMargin} />
                    <RadioGroup
                        title="Thumbnail Size"
                        groupName="gridThumbnails"
                        itemArray={allThumbnailSizes}
                        selectedValue={gridSettings.thumbnailSize}
                        onChange={gridSetThumbnailSize} />
                </Panel>

                <Panel title="List View">
                    <RadioGroup
                        title="Margins"
                        groupName="listMargin"
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

export default ViewSearch;
