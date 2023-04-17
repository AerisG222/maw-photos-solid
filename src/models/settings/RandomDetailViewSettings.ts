import { ThumbnailSizeIdType, defaultGridThumbnailSize } from '../ThumbnailSize';

export type RandomDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    showPhotoList: boolean;
};

export const defaultRandomDetailViewSettings: RandomDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: defaultGridThumbnailSize,
    showPhotoList: true,
};
