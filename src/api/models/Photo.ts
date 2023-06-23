import { PhotoMultimediaAsset } from './PhotoMultimediaAsset';

export type Photo = {
    id: number;
    categoryId: number;
    createDate: Date;
    latitude: number | null;
    longitude: number | null;
    imageXsSq: PhotoMultimediaAsset;
    imageXs: PhotoMultimediaAsset;
    imageSm: PhotoMultimediaAsset;
    imageMd: PhotoMultimediaAsset;
    imageLg: PhotoMultimediaAsset;
    imagePrt: PhotoMultimediaAsset;
    imageSrc: PhotoMultimediaAsset;
    self: string;
    categoryLink: string;
    commentsLink: string;
    exifLink: string;
    ratingLink: string;
};
