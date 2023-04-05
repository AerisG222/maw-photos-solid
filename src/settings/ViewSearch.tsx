import { Component } from "solid-js";

import { useSearchPageSettings } from '../contexts/SearchPageSettingsContext';
import { useSearchGridViewSettings } from '../contexts/SearchGridViewSettingsContext';
import { useSearchListViewSettings } from '../contexts/SearchListViewSettingsContext';
import { allThumbnailSizes } from '../models/ThumbnailSize';
import { allMargins } from '../models/Margin';
import { allCategoryViewModes } from '../models/CategoryViewMode';

import ContentLayout from '../components/layout/ContentLayout';
import Panel from './components/Panel';
import MainContent from '../components/layout/MainContent';
import PanelContainer from './components/PanelContainer';
import RadioGroup from './components/RadioGroup';
import Toolbar from './Toolbar';
import Toggle from './components/Toggle';

const ViewSearch: Component = () => {
    const [pageSettings, { setViewMode }] = useSearchPageSettings();
    const [listSettings, { setMargin: setListMargin, setThumbnailSize: setListThumbnailSize }] = useSearchListViewSettings();
    const [gridSettings, {
        setShowTitles: setGridShowTitles,
        setShowYears: setGridShowYears,
        setMargin: setGridMargin,
        setThumbnailSize: setGridThumbnailSize
    }] = useSearchGridViewSettings();

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Search">
                <PanelContainer>
                    <Panel title="Search Page">
                        <RadioGroup title="View Mode" groupName='pageViewMode' itemArray={allCategoryViewModes} selectedValue={pageSettings.viewMode} onChange={setViewMode} />
                    </Panel>

                    <Panel title="Grid View">
                        <Toggle title="Show Category Titles" name="gridShowTitles" isSelected={gridSettings.showTitles} onChange={setGridShowTitles} />
                        <Toggle title="Show Category Years" name="gridShowYears" isSelected={gridSettings.showYears} onChange={setGridShowYears} />
                        <RadioGroup title="Margins" groupName='gridMargin' itemArray={allMargins} selectedValue={gridSettings.margin} onChange={setGridMargin} />
                        <RadioGroup title="Thumbnail Size" groupName='gridThumbnails' itemArray={allThumbnailSizes} selectedValue={gridSettings.thumbnailSize} onChange={setGridThumbnailSize} />
                    </Panel>

                    <Panel title="List View">
                        <RadioGroup title="Margins" groupName='listMargin' itemArray={allMargins} selectedValue={listSettings.margin} onChange={setListMargin} />
                        <RadioGroup title="Thumbnail Size" groupName='listThumbnails' itemArray={allThumbnailSizes} selectedValue={listSettings.thumbnailSize} onChange={setListThumbnailSize} />
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewSearch;
