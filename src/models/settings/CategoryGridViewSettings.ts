import { MarginIdType, defaultMarginId } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSizeId } from '../thumbnail-size';

export type CategoryGridViewSettingsState = {
    readonly marginId: MarginIdType;
    readonly showTitles: boolean;
    readonly thumbnailSizeId: ThumbnailSizeIdType;
};

export const defaultCategoryGridViewSettings: CategoryGridViewSettingsState = {
    marginId: defaultMarginId,
    showTitles: true,
    thumbnailSizeId: defaultThumbnailSizeId,
};
