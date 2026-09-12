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

/*
   What the toggle in the navigation switches to.

   Deliberately not a three-way cycle through `system`. `system` renders as
   whichever of light or dark the operating system asks for, so on a dark
   desktop a cycle reads as dark, dark, light - one of the three presses appears
   to do nothing at all. The toggle flips away from what is actually on screen,
   which is always a visible change; `system` is chosen in settings, where it can
   say what it means.
*/
export const getToggledTheme = (resolved: ResolvedThemeIdType): ThemeIdType =>
    resolved === ThemeDark ? ThemeLight : ThemeDark;
