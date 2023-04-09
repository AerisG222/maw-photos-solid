import { MultimediaAsset } from './MultimediaAsset';

export type Video = {
    id: number;
    categoryId: number;
    createDate: Date;
    latitude: number | null;
    longitude: number | null;
    duration: number;
    thumbnailSq: MultimediaAsset;
    thumbnail: MultimediaAsset;
    videoScaled: MultimediaAsset;
    videoFull: MultimediaAsset;
    videoRaw: MultimediaAsset;
    self: string;
    categoryLink: string;
    commentsLink: string;
    ratingLink: string;
};
