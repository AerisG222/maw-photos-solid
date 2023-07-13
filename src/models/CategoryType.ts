export const CategoryTypePhoto = "photo";
export const CategoryTypeVideo = "video";
export type CategoryType = typeof CategoryTypePhoto | typeof CategoryTypeVideo;

type CategoryTypeInfo = {
    nameSingular: string;
    namePlural: string;
    routePart: string;  // todo: improve naming
    icon: string;
};

export const categoryTypes: Record<CategoryType, CategoryTypeInfo> = {
    photo: {
        nameSingular: "Photo",
        namePlural: "Photos",
        routePart: "photos",
        icon: "i-ic-round-camera-alt"
    },
    video: {
        nameSingular: "Video",
        namePlural: "Videos",
        routePart: "videos",
        icon: "i-ic-round-videocam"
    }
};
