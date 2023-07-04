export const MediaTypePhoto = "photo";
export const MediaTypeVideo = "video";
export type MediaTypes = typeof MediaTypePhoto | typeof MediaTypeVideo;

export type Photo = {
    kind: typeof MediaTypePhoto;
    id: number;
    categoryId: number;
    createDate: Date;
    latitude?: number;
    longitude?: number;
    imageXsUrl: string;
    imageXsWidth: number;
    imageXsSqUrl: string;
    imageSmUrl: string;
    imageSmWidth: number;
    imageMdUrl: string;
    imageMdWidth: number;
    imageLgUrl: string;
    imageLgWidth: number;
    imagePrtUrl: string;
};

export type Video = {
    kind: typeof MediaTypeVideo;
    id: number;
    categoryId: number;
    createDate: Date;
    latitude?: number;
    longitude?: number;
    thumbnailSqUrl: string;
    videoScaledUrl: string;
    videoScaledHeight: number;
    videoScaledWidth: number;
    videoFullUrl: string;
    videoFullHeight: number;
    videoFullWidth: number;
};

export type Media = Photo | Video;
