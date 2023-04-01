import { ThumbnailSizeIdType, defaultThumbnailSizeId } from '../thumbnail-size';

export type PhotoDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSizeId: ThumbnailSizeIdType;
    showPhotoList: boolean;
};

export const defaultPhotoDetailViewSettings: PhotoDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSizeId: defaultThumbnailSizeId,
    showPhotoList: true,
};
