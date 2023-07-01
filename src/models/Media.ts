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
    videoFullUrl: string;
};

export type Media = Photo | Video;
