import { Component } from "solid-js";

import { useCategoryFilterSettings } from '../contexts/CategoryFilterSettingsContext';
import { useCategoryPageSettings } from '../contexts/CategoryPageSettingsContext';
import { useCategoryGridViewSettings } from '../contexts/CategoryGridViewSettingsContext';
import { useCategoryListViewSettings } from '../contexts/CategoryListViewSettingsContext';
import { allCategoryTypeFilters } from '../models/category-type-filter';
import { allCategoryViewModes } from '../models/category-view-mode';
import { allMargins } from '../models/margin';
import { allThumbnailSizes } from '../models/thumbnail-size';

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

    // page
    const onChangePageFilterType = (evt: Event) => setTypeFilter(evt.currentTarget.value);
    const onChangePageViewMode = (evt: Event) => setViewMode(evt.currentTarget.value);

    // grid
    const onChangeGridMargin = (evt: Event) => setGridMargin(evt.currentTarget.value);
    const onChangeGridThumbnailSize = (evt: Event) => setGridThumbnailSize(evt.currentTarget.value);

    // list
    const onChangeListMargin = (evt: Event) => setListMargin(evt.currentTarget.value);
    const onChangeListThumbnailSize = (evt: Event) => setListThumbnailSize(evt.currentTarget.value);

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Categories">
                <PanelContainer>
                    <Panel title="Category Page">
                        <RadioGroup title="Type Filter" itemArray={allCategoryTypeFilters} groupName='pageTypeFilter' selectedValue={filterSettings.typeFilterId} onChange={onChangePageFilterType} />
                        <RadioGroup title="View" itemArray={allCategoryViewModes} groupName="pageView" selectedValue={pageSettings.viewModeId} onChange={onChangePageViewMode} />
                    </Panel>

                    <Panel title="Grid View">
                        <Toggle title="Show Titles" name="gridTitles" isSelected={gridSettings.showTitles} onChange={setGridShowTitles} />
                        <RadioGroup title="Margins" groupName="gridMargins" itemArray={allMargins} selectedValue={gridSettings.marginId} onChange={onChangeGridMargin} />
                        <RadioGroup title="Thumbnail Size" groupName="gridThumbnails" itemArray={allThumbnailSizes} selectedValue={gridSettings.thumbnailSizeId} onChange={onChangeGridThumbnailSize} />
                    </Panel>

                    <Panel title="List View">
                        <RadioGroup title="Margins" groupName="listMargins" itemArray={allMargins} selectedValue={listSettings.marginId} onChange={onChangeListMargin} />
                        <RadioGroup title="Thumbnail Size" groupName='listThumbnails' itemArray={allThumbnailSizes} selectedValue={listSettings.thumbnailSizeId} onChange={onChangeListThumbnailSize} />
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewCategories;
