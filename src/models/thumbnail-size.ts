import { KeyValuePair } from './key-value-pair';

export type ThumbnailSizeIdType = string;
export type ThumbnailSize = KeyValuePair<ThumbnailSizeIdType>;

export const allThumbnailSizes: ThumbnailSize[] = [
    { id: "default",   name: 'Default' },
    { id: "small",     name: 'Small' },
    { id: "verySmall", name: 'Very Small' },
    { id: "tiny",      name: 'Tiny' },
];

export const defaultThumbnailSize: ThumbnailSizeIdType = 'default';
