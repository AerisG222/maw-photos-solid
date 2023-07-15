import { ThemeIdType, defaultTheme } from '../Theme';

export type AppSettingsState = {
    readonly theme: ThemeIdType;
};

export const defaultAppSettings: AppSettingsState = {
    theme: defaultTheme
};
