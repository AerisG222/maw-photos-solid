import { KeyValuePair } from "./KeyValuePair";

export const ThemeLight = "light";
export const ThemeDark = "dark";
export const ThemeSystem = "system";

export type ThemeIdType = typeof ThemeLight | typeof ThemeDark | typeof ThemeSystem;

// what actually reaches `data-theme` - `system` resolves to one of these
export type ResolvedThemeIdType = typeof ThemeLight | typeof ThemeDark;

export const allThemes: KeyValuePair<ThemeIdType>[] = [
    { id: ThemeLight, name: "Light" },
    { id: ThemeDark, name: "Dark" },
    { id: ThemeSystem, name: "System" }
];

/*
   `system` for anyone who has not chosen. The application used to force dark
   while the `theme-color` meta tags in index.html already followed the
   operating system, so the browser chrome and the page disagreed.
*/
export const defaultTheme: ThemeIdType = ThemeSystem;

export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export const prefersDark = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(DARK_SCHEME_QUERY).matches;

export const resolveTheme = (
    theme: ThemeIdType,
    systemPrefersDark: boolean
): ResolvedThemeIdType => {
    if (theme === ThemeLight || theme === ThemeDark) {
        return theme;
    }

    return systemPrefersDark ? ThemeDark : ThemeLight;
};

// light -> dark -> system -> light
export const getNextTheme = (theme: ThemeIdType): ThemeIdType => {
    switch (theme) {
        case ThemeLight:
            return ThemeDark;
        case ThemeDark:
            return ThemeSystem;
        default:
            return ThemeLight;
    }
};
