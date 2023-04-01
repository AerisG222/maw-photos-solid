import { ThumbnailSizeIdType, defaultThumbnailSizeId } from '../thumbnail-size';

export type RandomDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSizeId: ThumbnailSizeIdType;
    showPhotoList: boolean;
};

export const defaultRandomDetailViewSettings: RandomDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSizeId: defaultThumbnailSizeId,
    showPhotoList: true,
};
