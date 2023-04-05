import { MarginIdType, defaultMargin } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSize } from '../thumbnail-size';

export type PhotoGridViewSettingsState = {
    margin: MarginIdType;
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
};

export const defaultPhotoGridViewSettings: PhotoGridViewSettingsState = {
    margin: defaultMargin,
    showBreadcrumbs: true,
    thumbnailSize: defaultThumbnailSize,
};
