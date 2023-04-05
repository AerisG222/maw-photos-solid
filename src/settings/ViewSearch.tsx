import { Component } from "solid-js";

import { useSearchPageSettings } from '../contexts/SearchPageSettingsContext';
import { useSearchGridViewSettings } from '../contexts/SearchGridViewSettingsContext';
import { useSearchListViewSettings } from '../contexts/SearchListViewSettingsContext';
import { allThumbnailSizes } from '../models/thumbnail-size';
import { allMargins } from '../models/margin';
import { allCategoryViewModes } from '../models/category-view-mode';

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

    // page
    const onChangePageViewMode = (evt: Event) => setViewMode(evt.currentTarget.value);

    // grid
    const onChangeGridMargin = (evt: Event) => setGridMargin(evt.currentTarget.value);
    const onChangeGridThumbnail = (evt: Event) => setGridThumbnailSize(evt.currentTarget.value);

    // list
    const onChangeListMargin = (evt: Event) => setListMargin(evt.currentTarget.value);
    const onChangeListThumbnail = (evt: Event) => setListThumbnailSize(evt.currentTarget.value);

    return (
        <ContentLayout>
            <Toolbar />
            <MainContent title="Settings - Search">
                <PanelContainer>
                    <Panel title="Search Page">
                        <RadioGroup title="View Mode" groupName='pageViewMode' itemArray={allCategoryViewModes} selectedValue={pageSettings.viewModeId} onChange={onChangePageViewMode} />
                    </Panel>

                    <Panel title="Grid View">
                        <Toggle title="Show Category Titles" name="gridShowTitles" isSelected={gridSettings.showTitles} onChange={setGridShowTitles} />
                        <Toggle title="Show Category Years" name="gridShowYears" isSelected={gridSettings.showYears} onChange={setGridShowYears} />
                        <RadioGroup title="Margins" groupName='gridMargin' itemArray={allMargins} selectedValue={gridSettings.marginId} onChange={onChangeGridMargin} />
                        <RadioGroup title="Thumbnail Size" groupName='gridThumbnails' itemArray={allThumbnailSizes} selectedValue={gridSettings.thumbnailSizeId} onChange={onChangeGridThumbnail} />
                    </Panel>

                    <Panel title="List View">
                        <RadioGroup title="Margins" groupName='listMargin' itemArray={allMargins} selectedValue={listSettings.marginId} onChange={onChangeListMargin} />
                        <RadioGroup title="Thumbnail Size" groupName='listThumbnails' itemArray={allThumbnailSizes} selectedValue={listSettings.thumbnailSizeId} onChange={onChangeListThumbnail} />
                    </Panel>
                </PanelContainer>
            </MainContent>
        </ContentLayout>
    );
};

export default ViewSearch;
