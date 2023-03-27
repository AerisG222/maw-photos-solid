import { ThumbnailSize } from '../thumbnail-size';

export type PhotoDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSize;
    showPhotoList: boolean;
};

export const defaultPhotoDetailViewSettings: PhotoDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: ThumbnailSize.default,
    showPhotoList: true,
};
