import { KeyValuePair } from './KeyValuePair';

export type ThemeIdType = string;
export type Theme = KeyValuePair<ThemeIdType> & {
    def: Record<string, string>
};

// https://oklch.com/

const themeDusk: Record<string, string> = {
    'base-100':        '#15151f',
    'base-200':        '#20202b',
    'base-300':        '#2c2d38',
    'base-content':    '#8a8b98',

    primary:           '#efb300',
    'primary-focus':   '#c79512',
    'primary-content': '#20202b',

    secondary:         '#7f75b8',
    accent:            '#7f75b8',
    neutral:           '#2c2d38',
};

const themeDark: Record<string, string> = {
    'base-100':      '#161616',
    'base-200':      '#1f1f1f',
    'base-300':      '#292929',
    'base-content':  '#97878b',

    primary:         '#751f1f',
    'primary-focus': '#6e2826',

    secondary:       '#c79512',
    accent:          '#c79512',
    neutral:         '#292929',
};

const themeDawn: Record<string, string> = {
    'base-100':        '#d6e7f8',
    'base-200':        '#badbfe',
    'base-300':        '#aecef1',
    'base-content':    '#262f38',

    primary:           '#5aa3ec',
    'primary-focus':   '#76b3f1',
    'primary-content': '#042f54',

    secondary:         '#7f75b8',
    accent:            '#7f75b8',
    neutral:           '#2c2d38',
};

const themeLight: Record<string, string> = {
    'base-100':      '#ffffff',
    'base-200':      '#ebebeb',
    'base-300':      '#d7d7d7',
    'base-content':  '#161616',

    primary:         '#62b811',
    'primary-focus': '#7bd23b',

    secondary:       '#21b8d0',
    accent:          '#21b8d0',
    neutral:         '#d7d7d7',
};

export const allThemes: Theme[] = [
    { id: 'dusk',  name: 'Dusk',  def: themeDusk },
    { id: 'dark',  name: 'Dark',  def: themeDark },
    { id: 'light', name: 'Light', def: themeLight },
    { id: 'dawn',  name: 'Dawn',  def: themeDawn },
];

export const getThemesForUno = (): Record<string, Record<string, string>>[] =>
    allThemes.map(t => ({ [t.id]: t.def }));

export const defaultTheme: ThemeIdType = "dusk";
