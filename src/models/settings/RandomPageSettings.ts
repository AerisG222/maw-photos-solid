import { PhotoViewMode } from '../photo-view-mode';
import { KEY_SETTINGS_RANDOM_PAGE, loadJson } from './storage';

export type RandomPageSettingsState = {
    readonly viewMode: PhotoViewMode;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultRandomPageSettings: RandomPageSettingsState = {
    viewMode: PhotoViewMode.grid,
    slideshowDisplayDurationSeconds: 2,
};

export function loadRandomPageSettings() {
    return loadJson(KEY_SETTINGS_RANDOM_PAGE, defaultRandomPageSettings);
}
