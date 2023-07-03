export type Photo = {
    kind: "photo";
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
    kind: "video";
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
