import { MarginIdType, defaultMarginId } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSizeId } from '../thumbnail-size';

export type RandomGridViewSettingsState = {
    marginId: MarginIdType;
    showBreadcrumbs: boolean;
    thumbnailSizeId: ThumbnailSizeIdType;
};

export const defaultRandomGridViewSettings: RandomGridViewSettingsState = {
    marginId: defaultMarginId,
    showBreadcrumbs: true,
    thumbnailSizeId: defaultThumbnailSizeId,
};
