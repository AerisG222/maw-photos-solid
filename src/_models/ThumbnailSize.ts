import { KeyValuePair } from "./KeyValuePair";
export const ThumbnailSizeDefault = "default";
export const ThumbnailSizeSmall = "small";
export const ThumbnailSizeVerySmall = "verySmall";
export const ThumbnailSizeTiny = "tiny";

export type ThumbnailSizeIdType =
    | typeof ThumbnailSizeDefault
    | typeof ThumbnailSizeSmall
    | typeof ThumbnailSizeVerySmall
    | typeof ThumbnailSizeTiny;

export type ThumbnailSize = KeyValuePair<ThumbnailSizeIdType> & {
    width: number;
    height: number;
};

const thumbnailSizes: Record<ThumbnailSizeIdType, ThumbnailSize> = {
    default: {
        id: ThumbnailSizeDefault,
        name: "Default",
        width: 160,
        height: 120
    },
    small: {
        id: ThumbnailSizeSmall,
        name: "Small",
        width: 120,
        height: 90
    },
    verySmall: {
        id: ThumbnailSizeVerySmall,
        name: "Very Small",
        width: 80,
        height: 60
    },
    tiny: {
        id: ThumbnailSizeTiny,
        name: "Tiny",
        width: 40,
        height: 30
    }
};

export const defaultListThumbnailSize = ThumbnailSizeVerySmall;

export const getThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => {
    switch (thumbnailSize) {
        case ThumbnailSizeDefault:
            return thumbnailSizes[ThumbnailSizeDefault];
        case ThumbnailSizeSmall:
            return thumbnailSizes[ThumbnailSizeSmall];
        case ThumbnailSizeVerySmall:
            return thumbnailSizes[ThumbnailSizeVerySmall];
        case ThumbnailSizeTiny:
            return thumbnailSizes[ThumbnailSizeTiny];
    }

    return thumbnailSizes[ThumbnailSizeDefault];
};
