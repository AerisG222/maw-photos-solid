export enum Theme {
    dark = 'dark',
    light = 'light',
    mulledWine = 'mulledWine',
    paleNight = 'paleNight',
}

export class ThemeDetail {
    static readonly dark = new ThemeDetail(
        Theme.dark,
        'Dark',
        'maw-dark-theme',
        true
    );
    static readonly light = new ThemeDetail(
        Theme.light,
        'Light',
        'maw-light-theme',
        false
    );
    static readonly mulledWine = new ThemeDetail(
        Theme.mulledWine,
        'Mulled Wine',
        'maw-mulled-wine-theme',
        true
    );
    static readonly paleNight = new ThemeDetail(
        Theme.paleNight,
        'Pale Night',
        'maw-pale-night-theme',
        true
    );

    constructor(
        public readonly theme: Theme,
        public readonly name: string,
        public readonly klass: string,
        public readonly isDark: boolean
    ) {}
}

export const allThemeDetails = [
    ThemeDetail.dark,
    ThemeDetail.light,
    ThemeDetail.mulledWine,
    ThemeDetail.paleNight,
];

export const toTheme = (val?: string | null): Theme | undefined => {
    if (!val) {
        return undefined;
    }

    return Theme[val as keyof typeof Theme];
};

export const toThemeDefaulted = (val?: string | null): Theme => {
    const theme = toTheme(val);

    return theme ? theme : Theme.dark;
};

export const toThemeDetail = (theme: Theme): ThemeDetail => {
    switch (theme) {
        case Theme.light:
            return ThemeDetail.light;
        case Theme.mulledWine:
            return ThemeDetail.mulledWine;
        case Theme.paleNight:
            return ThemeDetail.paleNight;
        case Theme.dark:
        default:
            return ThemeDetail.dark;
    }
};
