import { PhotoViewMode } from '../photo-view-mode';
import { KEY_SETTINGS_PHOTO_PAGE, loadJson } from './storage';

export type PhotoPageSettingsState = {
    readonly viewMode: PhotoViewMode;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultPhotoPageSettings: PhotoPageSettingsState = {
    viewMode: PhotoViewMode.grid,
    slideshowDisplayDurationSeconds: 2,
};

export function loadPhotoPageSettings() {
    return loadJson(KEY_SETTINGS_PHOTO_PAGE, defaultPhotoPageSettings);
}
