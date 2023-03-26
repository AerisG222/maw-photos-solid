import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';
import { KEY_SETTINGS_CATEGORY_VIEW_LIST, loadJson } from './storage';

export type CategoryListViewSettingsState = {
    readonly margin: Margin;
    readonly thumbnailSize: ThumbnailSize;
};

export const defaultCategoryListViewSettings: CategoryListViewSettingsState = {
    margin: Margin.dense,
    thumbnailSize: ThumbnailSize.default,
};

export function loadCategoryListViewSettings() {
    return loadJson(KEY_SETTINGS_CATEGORY_VIEW_LIST, defaultCategoryListViewSettings);
}
