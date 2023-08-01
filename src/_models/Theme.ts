import { KeyValuePair } from "./KeyValuePair";

export type ThemeIdType = string;
export type Theme = KeyValuePair<ThemeIdType> & {
    def: Record<string, string>
};

// https://oklch.com/
// https://color.adobe.com/create/color-wheel

const themeDusk: Record<string, string> = {
    "base-100":        "#15151f",
    "base-200":        "#20202b",
    "base-300":        "#2c2d38",
    "base-content":    "#8a8b98",

    primary:           "#efb300",
    secondary:         "#7f75b8",
    accent:            "#7f75b8",
    neutral:           "#2c2d38",
};

const themeDark: Record<string, string> = {
    "base-100":      "#161616",
    "base-200":      "#1f1f1f",
    "base-300":      "#292929",
    "base-content":  "#bbaaaa",

    primary:         "#c03113",
    secondary:       "#e39f22",
    accent:          "#e39f22",
    neutral:         "#292929",
};

const themeLight: Record<string, string> = {
    "base-100":      "#ffffff",
    "base-200":      "#fafafe",
    "base-300":      "#f1f1f7",
    "base-content":  "#444444",

    primary:         "#eb4927",
    secondary:       "#ffb842",
    accent:          "#ffb842",
    neutral:         "#dfdfdf",
};

export const allThemes: Theme[] = [
    { id: "dusk",  name: "Dusk",  def: themeDusk },
    { id: "dark",  name: "Dark",  def: themeDark },
    { id: "light", name: "Light", def: themeLight },
];

export const getThemesForUno = (): Record<string, Record<string, string>>[] =>
    allThemes.map(t => ({ [t.id]: t.def }));

export const defaultTheme: ThemeIdType = "dusk";
