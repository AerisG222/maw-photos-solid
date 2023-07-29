import { KeyValuePair } from './KeyValuePair';

export type ThemeIdType = string;
export type Theme = KeyValuePair<ThemeIdType> & {
    def: Record<string, string>
};

const themeDusk: Record<string, string> = {
    'base-100':        '#15151f', // oklch(20% 0.02 284)
    'base-200':        '#20202b', // oklch(25% 0.02 284)
    'base-300':        '#2c2d38', // oklch(30% 0.02 284)
    'base-content':    '#8a8b98', // oklch(64% 0.02 284)

    primary:           '#efb300', // oklch(80% 0.18 84)
    'primary-focus':   '#c79512', // oklch(70% 0.14 84)
    'primary-content': '#20202b', // oklch(25% 0.02 284)

    secondary:         '#7f75b8', // oklch(60% 0.1 290)
    accent:            '#7f75b8', // oklch(60% 0.1 290)
    neutral:           '#2c2d38', // oklch(30% 0.02 284)
};

const themeDark: Record<string, string> = {
    'base-100':      '#161616', // oklch(20% 0.00 0.00)
    'base-200':      '#1f1f1f', // oklch(24% 0.00 0.00)
    'base-300':      '#292929', // oklch(28% 0.00 0.00)
    'base-content':  '#97878b', // oklch(64% 0.02 0)

    primary:         '#751f1f', // oklch(38% 0.12 25)
    'primary-focus': '#6e2826', // oklch(38% 0.11 25)

    secondary:       '#c79512', // oklch(70% 0.14 84)
    accent:          '#c79512', // oklch(70% 0.14 84)
    neutral:         '#292929', // oklch(28% 0.00 0.00)
};

const themeDawn: Record<string, string> = {
    'base-100':        '#d6e7f8', // oklch(92% 0.03 250)
    'base-200':        '#badbfe', // oklch(88% 0.06 250)
    'base-300':        '#aecef1', // oklch(84% 0.06 250)
    'base-content':    '#262f38', // oklch(30% 0.02 250)

    primary:           '#5aa3ec', // oklch(70% 0.13 250)
    'primary-focus':   '#76b3f1', // oklch(75% 0.11 250)
    'primary-content': '#042f54', // oklch(30% 0.08 250)

    secondary:         '#7f75b8', // oklch(60% 0.1 290)
    accent:            '#7f75b8', // oklch(60% 0.1 290)
    neutral:           '#2c2d38', // oklch(30% 0.02 284)
};

const themeLight: Record<string, string> = {
    'base-100':      '#ffffff', // oklch(100% 0 0)
    'base-200':      '#ebebeb', // oklch(94% 0 0)
    'base-300':      '#d7d7d7', // oklch(88% 0 0)
    'base-content':  '#161616', // oklch(20% 0 0)

    primary:         '#62b811', // oklch(70% 0.2 135)
    'primary-focus': '#7bd23b', // oklch(78% 0.2 135)

    secondary:       '#21b8d0', // oklch(72% 0.12 212)
    accent:          '#21b8d0', // oklch(72% 0.12 212)
    neutral:         '#d7d7d7', // oklch(28% 0.00 0.00)
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
