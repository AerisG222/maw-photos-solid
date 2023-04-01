import { ThemeIdType, defaultThemeId } from '../theme';

export type AppSettingsState = {
    readonly themeId: ThemeIdType;
};

export const defaultAppSettings: AppSettingsState = {
    themeId: defaultThemeId
};
