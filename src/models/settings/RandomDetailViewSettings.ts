import { ThumbnailSize } from '../thumbnail-size';

export type RandomDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSize;
    showPhotoList: boolean;
};

export const defaultRandomDetailViewSettings: RandomDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: ThumbnailSize.default,
    showPhotoList: true,
};
