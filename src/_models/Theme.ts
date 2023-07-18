import { KeyValuePair } from './KeyValuePair';

export type ThemeIdType = string;
export type Theme = KeyValuePair<ThemeIdType>;

export const allThemes: Theme[] = [
    { id: 'halloween', name: 'Halloween' },
    { id: 'lemonade',  name: 'Lemonade' },
    { id: 'coffee',    name: 'Coffee' },
    { id: 'winter',    name: 'Winter' },
];

export const defaultTheme: ThemeIdType = "halloween";
