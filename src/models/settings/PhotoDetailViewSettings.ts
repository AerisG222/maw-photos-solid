import { ThumbnailSizeIdType, defaultThumbnailSize } from '../thumbnail-size';

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
