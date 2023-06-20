import { ParentComponent } from 'solid-js';

import { AppSettingsProvider } from './AppSettingsContext';
import { CategoryFilterSettingsProvider } from './CategoryFilterSettingsContext';
import { CategoryGridSettingsProvider } from './CategoryGridViewSettingsContext';
import { CategoryListSettingsProvider } from './CategoryListViewSettingsContext';
import { CategoryPageSettingsProvider } from './CategoryPageSettingsContext';
import { PhotoDetailSettingsProvider } from './PhotoDetailViewSettingsContext';
import { PhotoGridSettingsProvider } from './PhotoGridViewSettingsContext';
import { PhotoInfoPanelSettingsProvider } from './PhotoInfoPanelSettingsContext';
import { PhotoMapSettingsProvider } from './PhotoMapViewSettingsContext';
import { PhotoPageSettingsProvider } from './PhotoPageSettingsContext';
import { RandomDetailSettingsProvider } from './RandomDetailViewSettingsContext';
import { RandomGridSettingsProvider } from './RandomGridViewSettingsContext';
import { SearchGridSettingsProvider } from './SearchGridViewSettingsContext';
import { SearchListSettingsProvider } from './SearchListViewSettingsContext';
import { SearchPageSettingsProvider } from './SearchPageSettingsContext';
import { VideoDetailSettingsProvider } from './VideoDetailViewSettingsContext';
import { VideoInfoPanelSettingsProvider } from './VideoInfoPanelSettingsContext';
import { RandomPageSettingsProvider } from './RandomPageSettingsContext';

export const AllSettingsProvider: ParentComponent = (props) => {
    return (
        <AppSettingsProvider>
        <CategoryFilterSettingsProvider>
        <CategoryGridSettingsProvider>
        <CategoryListSettingsProvider>
        <CategoryPageSettingsProvider>
        <PhotoDetailSettingsProvider>
        <PhotoGridSettingsProvider>
        <PhotoInfoPanelSettingsProvider>
        <PhotoMapSettingsProvider>
        <PhotoPageSettingsProvider>
        <RandomPageSettingsProvider>
        <RandomDetailSettingsProvider>
        <RandomGridSettingsProvider>
        <SearchGridSettingsProvider>
        <SearchListSettingsProvider>
        <SearchPageSettingsProvider>
        <VideoDetailSettingsProvider>
        <VideoInfoPanelSettingsProvider>
            {props.children}
        </VideoInfoPanelSettingsProvider>
        </VideoDetailSettingsProvider>
        </SearchPageSettingsProvider>
        </SearchListSettingsProvider>
        </SearchGridSettingsProvider>
        </RandomGridSettingsProvider>
        </RandomDetailSettingsProvider>
        </RandomPageSettingsProvider>
        </PhotoPageSettingsProvider>
        </PhotoMapSettingsProvider>
        </PhotoInfoPanelSettingsProvider>
        </PhotoGridSettingsProvider>
        </PhotoDetailSettingsProvider>
        </CategoryPageSettingsProvider>
        </CategoryListSettingsProvider>
        </CategoryGridSettingsProvider>
        </CategoryFilterSettingsProvider>
        </AppSettingsProvider>
    );
}
