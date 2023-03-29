import { Theme } from '../theme';

export type AppSettingsState = {
    readonly theme: Theme;
};

export const defaultAppSettings: AppSettingsState = {
    theme: Theme.dark
};
