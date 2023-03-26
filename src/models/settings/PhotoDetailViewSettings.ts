import { ThumbnailSize } from '../thumbnail-size';
import { KEY_SETTINGS_PHOTO_VIEW_DETAIL, loadJson } from './storage';

export type PhotoDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSize;
    showPhotoList: boolean;
};

export const defaultPhotoDetailViewSettings: PhotoDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: ThumbnailSize.default,
    showPhotoList: true,
};

export function loadPhotoDetailViewSettings() {
    return loadJson(KEY_SETTINGS_PHOTO_VIEW_DETAIL, defaultPhotoDetailViewSettings);
}
