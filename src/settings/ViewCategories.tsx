import { Component } from "solid-js";

import { useCategoryFilterSettings } from '../contexts/CategoryFilterSettingsContext';
import { useCategoryPageSettings } from '../contexts/CategoryPageSettingsContext';
import { useCategoryGridViewSettings } from '../contexts/CategoryGridViewSettingsContext';
import { useCategoryListViewSettings } from '../contexts/CategoryListViewSettingsContext';
import { allCategoryTypeFilters } from '../models/CategoryTypeFilter';
import { allCategoryViewModes } from '../models/CategoryViewMode';
import { allMargins } from '../models/Margin';
import { allThumbnailSizes } from '../models/ThumbnailSize';

import ContentLayout from '../components/layout/ContentLayout';
import MainContent from '../components/layout/MainContent';
import Panel from './components/Panel';
import PanelContainer from './components/PanelContainer';
import RadioGroup from './components/RadioGroup';
import Toolbar from './Toolbar';
import Toggle from './components/Toggle';

const ViewCategories: Component = () => {
    const [filterSettings, { setTypeFilter }] = useCategoryFilterSettings();
    const [pageSettings, { setViewMode }] = useCategoryPageSettings();
    const [gridSettings, {
        setShowTitles: setGridShowTitles,
        setMargin: setGridMargin,
        setThumbnailSize: setGridThumbnailSize
    }] = useCategoryGridViewSettings();
    const [listSettings, {
        setMargin: setListMargin,
        setThumbnailSize: setListThumbnailSize
    }] = useCategoryListViewSettings()

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Categories">
                <PanelContainer>
                    <Panel title="Category Page">
                        <RadioGroup title="Type Filter" itemArray={allCategoryTypeFilters} groupName='pageTypeFilter' selectedValue={filterSettings.typeFilter} onChange={setTypeFilter} />
                        <RadioGroup title="View" itemArray={allCategoryViewModes} groupName="pageView" selectedValue={pageSettings.viewMode} onChange={setViewMode} />
                    </Panel>

                    <Panel title="Grid View">
                        <Toggle title="Show Titles" name="gridTitles" isSelected={gridSettings.showTitles} onChange={setGridShowTitles} />
                        <RadioGroup title="Margins" groupName="gridMargins" itemArray={allMargins} selectedValue={gridSettings.margin} onChange={setGridMargin} />
                        <RadioGroup title="Thumbnail Size" groupName="gridThumbnails" itemArray={allThumbnailSizes} selectedValue={gridSettings.thumbnailSize} onChange={setGridThumbnailSize} />
                    </Panel>

                    <Panel title="List View">
                        <RadioGroup title="Margins" groupName="listMargins" itemArray={allMargins} selectedValue={listSettings.margin} onChange={setListMargin} />
                        <RadioGroup title="Thumbnail Size" groupName='listThumbnails' itemArray={allThumbnailSizes} selectedValue={listSettings.thumbnailSize} onChange={setListThumbnailSize} />
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewCategories;
