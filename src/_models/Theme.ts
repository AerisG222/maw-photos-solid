import { KeyValuePair } from './KeyValuePair';

export type ThemeIdType = string;
export type Theme = KeyValuePair<ThemeIdType> & {
    def: Record<string, string>
};

const themeDarkBlue: Record<string, string> = {
    primary:         '#efb300', // oklch(80% 0.18 84)
    'primary-focus': '#c79512', // oklch(70% 0.14 84)

    'base-100':      '#15151f', // oklch(20% 0.02 284)
    'base-200':      '#20202b', // oklch(25% 0.02 284)
    'base-300':      '#2c2d38', // oklch(30% 0.02 284)
}

export const allThemes: Theme[] = [
    { id: 'dark-blue', name: 'Dark Blue', def: themeDarkBlue }
];

export const getThemesForUno = (): Record<string, Record<string, string>>[] =>
    allThemes.map(t => ({ [t.id]: t.def }));

export const defaultTheme: ThemeIdType = "dark-blue";
