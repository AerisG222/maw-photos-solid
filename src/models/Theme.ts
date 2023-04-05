import { KeyValuePair } from './KeyValuePair';

export type ThemeIdType = string;
export type Theme = KeyValuePair<ThemeIdType>;

export const allThemes: Theme[] = [
    { id: 'dark',      name: 'Dark' },
    { id: 'light',     name: 'Light' },
    { id: 'cupcake',   name: 'Cupcake' },
    { id: 'bumblebee', name: 'Bumblebee' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'synthwave', name: 'Synthwave' },
    { id: 'retro',     name: 'Retro' },
    { id: 'halloween', name: 'Halloween' },
    { id: 'garden',    name: 'Garden' },
    { id: 'aqua',      name: 'Aqua' },
    { id: 'fantasy',   name: 'Fantasy' },
    { id: 'luxury',    name: 'Luxury' },
    { id: 'dracula',   name: 'Dracula' },
    { id: 'autumn',    name: 'Autumn' },
    { id: 'business',  name: 'Business' },
    { id: 'lemonade',  name: 'Lemonade' },
    { id: 'night',     name: 'Night' },
    { id: 'coffee',    name: 'Coffee' },
    { id: 'winter',    name: 'Winter' },
];

export const defaultTheme: ThemeIdType = "dark";
