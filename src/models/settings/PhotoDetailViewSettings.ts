import { ThumbnailSizeIdType, defaultThumbnailSize } from '../ThumbnailSize';

export type PhotoDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    showPhotoList: boolean;
};

export const defaultPhotoDetailViewSettings: PhotoDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: defaultThumbnailSize,
    showPhotoList: true,
};
