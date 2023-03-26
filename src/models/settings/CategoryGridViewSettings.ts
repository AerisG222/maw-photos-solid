import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';
import { KEY_SETTINGS_CATEGORY_VIEW_GRID, loadJson } from './storage';

export type CategoryGridViewSettingsState = {
    readonly margin: Margin;
    readonly showTitles: boolean;
    readonly thumbnailSize: ThumbnailSize;
};

export const defaultCategoryGridViewSettings: CategoryGridViewSettingsState = {
    margin: Margin.dense,
    showTitles: true,
    thumbnailSize: ThumbnailSize.default,
};

export function loadCategoryGridViewSettings() {
    return loadJson(KEY_SETTINGS_CATEGORY_VIEW_GRID, defaultCategoryGridViewSettings);
}
