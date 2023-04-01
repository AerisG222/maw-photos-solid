import { allThemes } from '../theme';

export type AppSettingsState = {
    readonly theme: string;
};

export const defaultAppSettings: AppSettingsState = {
    theme: allThemes[0]
};
