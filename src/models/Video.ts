export type Video = {
    id: number;
    categoryId: number;
    createDate: Date;
    latitude?: number;
    longitude?: number;
    thumbnailSqUrl: string;
    videoScaledUrl: string;
    videoFullUrl: string;
};
