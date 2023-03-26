import { ThumbnailSize } from '../thumbnail-size';
import { KEY_SETTINGS_RANDOM_VIEW_DETAIL, loadJson } from './storage';

export type RandomDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSize;
    showPhotoList: boolean;
};

export const defaultRandomDetailViewSettings: RandomDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: ThumbnailSize.default,
    showPhotoList: true,
};

export function loadRandomDetailViewSettings() {
    return loadJson(KEY_SETTINGS_RANDOM_VIEW_DETAIL, defaultRandomDetailViewSettings);
}
