import { KeyValuePair } from './KeyValuePair';
import { equalsIgnoreCase } from './Utils';

export type ThumbnailSizeIdType = string;
export type ThumbnailSize = KeyValuePair<ThumbnailSizeIdType> & { klass: any };

export const allThumbnailSizes: ThumbnailSize[] = [
    { id: "default",   name: 'Default',    klass: { 'w-[160px]': true, 'h-[120px]': true } },
    { id: "small",     name: 'Small',      klass: { 'w-[120px]': true, 'h-[90px]': true } },
    { id: "verySmall", name: 'Very Small', klass: { 'w-[80px]': true,  'h-[60px]': true } },
    { id: "tiny",      name: 'Tiny',       klass: { 'w-[40px]': true,  'h-[30px]': true } },
];

export const allThumbnailClasses = allThumbnailSizes
    .map(x => Object.keys(x.klass))
    .flat(1);

export const defaultThumbnailSize: ThumbnailSizeIdType = 'default';

export const getNextThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => {
    var idx = allThumbnailSizes.findIndex(x => equalsIgnoreCase(x.id, thumbnailSize));

    if(idx === allThumbnailSizes.length - 1) {
        idx = -1;
    }

    return allThumbnailSizes[idx + 1];
}
