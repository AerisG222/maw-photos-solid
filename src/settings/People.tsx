import { Component } from "solid-js";

import { usePeopleGridViewSettingsContext } from "../_contexts/settings/PeopleGridViewSettingsContext";
import { allMargins } from "../_models/Margin";
import { allPersonSorts } from "../_models/PersonSort";
import { allThumbnailSizes } from "../_models/ThumbnailSize";

import Panel from "./components/Panel";
import PanelContainer from "./components/PanelContainer";
import RadioGroup from "../_components/input/RadioGroup";
import Toolbar from "./components/Toolbar";
import Toggle from "../_components/input/Toggle";
import Layout from "../_components/layout/Layout";

const ViewPeople: Component = () => {
    const [
        gridSettings,
        {
            setShowNames,
            setShowMediaCounts,
            setMargin,
            setThumbnailSize,
            setDimThumbnails,
            setSortBy
        }
    ] = usePeopleGridViewSettingsContext();

    return (
        <Layout toolbar={<Toolbar />} title="People">
            <PanelContainer>
                <Panel title="Grid View">
                    <RadioGroup
                        title="Sort By"
                        groupName="gridSortBy"
                        itemArray={allPersonSorts}
                        selectedValue={gridSettings.sortBy}
                        onChange={setSortBy}
                    />
                    <Toggle
                        title="Show Names"
                        name="gridShowNames"
                        isSelected={gridSettings.showNames}
                        onChange={setShowNames}
                    />
                    <Toggle
                        title="Show Media Counts"
                        name="gridShowMediaCounts"
                        isSelected={gridSettings.showMediaCounts}
                        onChange={setShowMediaCounts}
                    />
                    <RadioGroup
                        title="Margins"
                        groupName="gridMargins"
                        itemArray={allMargins}
                        selectedValue={gridSettings.margin}
                        onChange={setMargin}
                    />
                    <RadioGroup
                        title="Thumbnail Size"
                        groupName="gridThumbnails"
                        itemArray={allThumbnailSizes}
                        selectedValue={gridSettings.thumbnailSize}
                        onChange={setThumbnailSize}
                    />
                    <Toggle
                        title="Dim Thumbnails"
                        name="gridDimThumbnails"
                        isSelected={gridSettings.dimThumbnails}
                        onChange={setDimThumbnails}
                    />
                </Panel>
            </PanelContainer>
        </Layout>
    );
};

export default ViewPeople;
