import { MarginIdType, defaultMarginId } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSizeId } from '../thumbnail-size';

export type CategoryListViewSettingsState = {
    readonly marginId: MarginIdType;
    readonly thumbnailSizeId: ThumbnailSizeIdType;
};

export const defaultCategoryListViewSettings: CategoryListViewSettingsState = {
    marginId: defaultMarginId,
    thumbnailSizeId: defaultThumbnailSizeId,
};
