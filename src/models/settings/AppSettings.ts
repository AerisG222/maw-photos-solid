import { KEY_SETTINGS_APP, loadJson } from './storage';

export type AppSettingsState = {
    readonly theme: string;
};

export const defaultAppSettings: AppSettingsState = {
    theme: 'dark'
};

export function loadAppSettings() {
    return loadJson(KEY_SETTINGS_APP, defaultAppSettings);
}
