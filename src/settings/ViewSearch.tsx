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

const ViewSearch: Component = () => {
    const [pageSettings, { setViewMode }] = useSearchPageSettings();
    const [gridSettings, { setShowTitles, setShowYears, setMargin: setGridMargin, setThumbnailSize: setGridThumbnailSize }] = useSearchGridViewSettings();
    const [listSettings, { setMargin: setListMargin, setThumbnailSize: setListThumbnailSize }] = useSearchListViewSettings();

    // page
    const onChangePageViewMode = (evt: Event) => setViewMode(evt.currentTarget.value);

    // grid
    const onChangeGridShowTitles = (evt: Event) => setShowTitles(evt.currentTarget.value);
    const onChangeGridShowYears = (evt: Event) => setShowYears(evt.currentTarget.value);
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
                        <h3 class="mt-4">Show Category Titles</h3>
                        <input type="checkbox" class="toggle" name="gridShowTitles" onChange={onChangeGridShowTitles} />

                        <h3 class="mt-4">Show Category Years</h3>
                        <input type="checkbox" class="toggle" name="detailShowYears" onChange={onChangeGridShowYears} />

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
