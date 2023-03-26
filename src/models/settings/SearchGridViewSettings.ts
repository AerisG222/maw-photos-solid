import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';
import { KEY_SETTINGS_SEARCH_VIEW_GRID, loadJson } from './storage';

export type SearchGridViewSettingsState = {
    margin: Margin;
    showTitles: boolean;
    showYears: boolean;
    thumbnailSize: ThumbnailSize;
};

export const defaultSearchGridViewSettings: SearchGridViewSettingsState = {
    margin: Margin.dense,
    showTitles: true,
    showYears: true,
    thumbnailSize: ThumbnailSize.default,
};

export function loadSearchGridViewSettings() {
    return loadJson(KEY_SETTINGS_SEARCH_VIEW_GRID, defaultSearchGridViewSettings);
}
