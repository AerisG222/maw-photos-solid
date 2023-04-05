import { ThemeIdType, defaultTheme } from '../theme';

export type AppSettingsState = {
    readonly theme: ThemeIdType;
};

export const defaultAppSettings: AppSettingsState = {
    theme: defaultTheme
};
