import { MarginIdType, defaultMarginId } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSizeId } from '../thumbnail-size';

export type PhotoGridViewSettingsState = {
    marginId: MarginIdType;
    showBreadcrumbs: boolean;
    thumbnailSizeId: ThumbnailSizeIdType;
};

export const defaultPhotoGridViewSettings: PhotoGridViewSettingsState = {
    marginId: defaultMarginId,
    showBreadcrumbs: true,
    thumbnailSizeId: defaultThumbnailSizeId,
};
