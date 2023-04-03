import { Component } from "solid-js";

import ContentLayout from '../components/layout/ContentLayout';
import { allCategoryTypeFilters } from '../models/category-type-filter';
import { allCategoryViewModes } from '../models/category-view-mode';
import { allMargins } from '../models/margin';
import { allThumbnailSizes } from '../models/thumbnail-size';
import Toolbar from './Toolbar';
import Panel from './components/Panel';
import MainContent from '../components/layout/MainContent';
import PanelContainer from './components/PanelContainer';
import RadioGroup from './components/RadioGroup';
import { useCategoryFilterSettings } from '../contexts/CategoryFilterSettingsContext';
import { useCategoryPageSettings } from '../contexts/CategoryPageSettingsContext';
import { useCategoryGridViewSettings } from '../contexts/CategoryGridViewSettingsContext';
import { useCategoryListViewSettings } from '../contexts/CategoryListViewSettingsContext';

const ViewCategories: Component = () => {
    const [filterSettings, { setTypeFilter }] = useCategoryFilterSettings();
    const [pageSettings, { setViewMode }] = useCategoryPageSettings();
    const [gridSettings, { setShowTitles, setMargin: setGridMargin, setThumbnailSize: setGridThumbnailSize }] = useCategoryGridViewSettings();
    const [listSettings, { setMargin: setListMargin , setThumbnailSize: setListThumbnailSize }] = useCategoryListViewSettings()

    const onChangePageFilterType = (evt: Event) => {
        evt.preventDefault();
        setTypeFilter(evt.currentTarget.value);
    }

    const onChangePageViewMode = (evt: Event) => {
        evt.preventDefault();
        setViewMode(evt.currentTarget.value);
    }

    const onChangeGridShowTitles = (evt: Event) => {
        evt.preventDefault();
        setShowTitles(evt.currentTarget.value);
    }

    const onChangeGridMargin = (evt: Event) => {
        evt.preventDefault();
        setGridMargin(evt.currentTarget.value);
    }

    const onChangeGridThumbnailSize = (evt: Event) => {
        evt.preventDefault();
        setGridThumbnailSize(evt.currentTarget.value);
    }

    const onChangeListMargin = (evt: Event) => {
        evt.preventDefault();
        setListMargin(evt.currentTarget.value);
    }

    const onChangeListThumbnailSize = (evt: Event) => {
        evt.preventDefault();
        setListThumbnailSize(evt.currentTarget.value);
    }

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
                        <h3>Show Titles</h3>
                        <div>
                            <input type="checkbox" class="toggle" name="gridTitles" onChange={evt => onChangeGridShowTitles(evt)} checked={gridSettings.showTitles} />
                        </div>

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
