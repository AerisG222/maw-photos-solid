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
import { SearchGridSettingsProvider } from './SearchGridViewSettingsContext';
import { SearchListSettingsProvider } from './SearchListViewSettingsContext';
import { SearchPageSettingsProvider } from './SearchPageSettingsContext';

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
        <SearchGridSettingsProvider>
        <SearchListSettingsProvider>
        <SearchPageSettingsProvider>
            {props.children}
        </SearchPageSettingsProvider>
        </SearchListSettingsProvider>
        </SearchGridSettingsProvider>
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
};
