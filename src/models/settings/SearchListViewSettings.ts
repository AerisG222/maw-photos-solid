import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';
import { KEY_SETTINGS_SEARCH_VIEW_LIST, loadJson } from './storage';

export type SearchListViewSettingsState = {
    readonly margin: Margin;
    readonly thumbnailSize: ThumbnailSize;
};

export const defaultSearchListViewSettings: SearchListViewSettingsState = {
    margin: Margin.dense,
    thumbnailSize: ThumbnailSize.default,
};

export function loadSearchListViewSettings() {
    return loadJson(KEY_SETTINGS_SEARCH_VIEW_LIST, defaultSearchListViewSettings);
}
