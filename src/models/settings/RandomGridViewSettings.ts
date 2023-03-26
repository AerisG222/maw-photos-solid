import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';
import { KEY_SETTINGS_RANDOM_VIEW_GRID, loadJson } from './storage';

export type RandomGridViewSettingsState = {
    margin: Margin;
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSize;
};

export const defaultRandomGridViewSettings: RandomGridViewSettingsState = {
    margin: Margin.dense,
    showBreadcrumbs: true,
    thumbnailSize: ThumbnailSize.default,
};

export function loadRandomGridViewSettings() {
    return loadJson(KEY_SETTINGS_RANDOM_VIEW_GRID, defaultRandomGridViewSettings);
}
