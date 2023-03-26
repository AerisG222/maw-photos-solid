import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';
import { KEY_SETTINGS_PHOTO_VIEW_GRID, loadJson } from './storage';

export type PhotoGridViewSettingsState = {
    margin: Margin;
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSize;
};

export const defaultPhotoGridViewSettings: PhotoGridViewSettingsState = {
    margin: Margin.dense,
    showBreadcrumbs: true,
    thumbnailSize: ThumbnailSize.default,
};

export function loadPhotoGridViewSettings() {
    return loadJson(KEY_SETTINGS_PHOTO_VIEW_GRID, defaultPhotoGridViewSettings);
}
