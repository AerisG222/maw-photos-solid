import { KeyValuePair } from './KeyValuePair';

export type ThemeIdType = string;
export type Theme = KeyValuePair<ThemeIdType> & {
    def: Record<string, string>
};

const themeDarkBlue: Record<string, string> = {
    primary:           '#efb300', // oklch(80% 0.18 84)
    'primary-focus':   '#c79512', // oklch(70% 0.14 84)
    'primary-content': '#20202b', // oklch(25% 0.02 284)

    secondary:         '#7f75b8', // oklch(60% 0.1 290)
    accent:            '#7f75b8', // oklch(60% 0.1 290)

    'base-100':        '#15151f', // oklch(20% 0.02 284)
    'base-200':        '#20202b', // oklch(25% 0.02 284)
    'base-300':        '#2c2d38', // oklch(30% 0.02 284)
    'base-content':    '#8a8b98', // oklch(64% 0.02 284)
};

const themeDarkGray: Record<string, string> = {
    primary:         '#efb300', //
    'primary-focus': '#c79512', // oklch(70% 0.14 84)

    'base-100':      '#161616', // oklch(20% 0.00 0.00)
    'base-200':      '#1f1f1f', // oklch(24% 0.00 0.00)
    'base-300':      '#292929', // oklch(28% 0.00 0.00)
};

export const allThemes: Theme[] = [
    { id: 'dark-blue', name: 'Dark Blue', def: themeDarkBlue },
    { id: 'dark-gray', name: 'Dark Gray', def: themeDarkGray }
];

export const getThemesForUno = (): Record<string, Record<string, string>>[] =>
    allThemes.map(t => ({ [t.id]: t.def }));

export const defaultTheme: ThemeIdType = "dark-blue";
