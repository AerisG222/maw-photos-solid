export type AppSettingsState = {
    readonly theme: string;
};

export const defaultAppSettings: AppSettingsState = {
    theme: 'dark'
};
