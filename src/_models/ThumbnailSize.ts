import { KeyValuePair } from "./KeyValuePair";
import { equalsIgnoreCase } from "./utils/StringUtils";

export type ThumbnailSizeIdType = string;
export type ThumbnailSize = KeyValuePair<ThumbnailSizeIdType> & {
    width: number,
    height: number,
    klass: {}
};

export const allThumbnailSizes: ThumbnailSize[] = [
    { id: "default",   name: "Default",    width: 160, height: 120, klass: { "w-[160px]": true, "h-[120px]": true } },
    { id: "small",     name: "Small",      width: 120, height:  90, klass: { "w-[120px]": true, "h-[90px]":  true } },
    { id: "verySmall", name: "Very Small", width:  80, height:  60, klass: { "w-[80px]":  true, "h-[60px]":  true } },
    { id: "tiny",      name: "Tiny",       width:  40, height:  30, klass: { "w-[40px]":  true, "h-[30px]":  true } },
];

export const allThumbnailClasses = new Set(allThumbnailSizes
    .map(x => Object.keys(x.klass))
    .flat(1)
);

export const defaultGridThumbnailSize: ThumbnailSizeIdType = "default";
export const defaultListThumbnailSize: ThumbnailSizeIdType = "verySmall";

export const getThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => {
    return allThumbnailSizes.find(x => equalsIgnoreCase(x.id, thumbnailSize)) ?? allThumbnailClasses[0];
};

export const getNextThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => {
    var idx = allThumbnailSizes.findIndex(x => equalsIgnoreCase(x.id, thumbnailSize));

    if(idx === allThumbnailSizes.length - 1) {
        idx = -1;
    }

    return allThumbnailSizes[idx + 1];
};

export const getThumbnailClass = (thumbnailSize: ThumbnailSizeIdType) => allThumbnailSizes
        .filter(x => equalsIgnoreCase(x.id, thumbnailSize))
        .map(x => x.klass)[0];
