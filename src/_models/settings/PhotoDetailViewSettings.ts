import { ThumbnailSizeIdType, defaultGridThumbnailSize } from '../ThumbnailSize';

export type PhotoDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    showPhotoList: boolean;
};

export const defaultPhotoDetailViewSettings: PhotoDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: defaultGridThumbnailSize,
    showPhotoList: true,
};
