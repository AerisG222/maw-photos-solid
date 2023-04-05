import { ThumbnailSizeIdType, defaultThumbnailSize } from '../thumbnail-size';

export type RandomDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    showPhotoList: boolean;
};

export const defaultRandomDetailViewSettings: RandomDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: defaultThumbnailSize,
    showPhotoList: true,
};
