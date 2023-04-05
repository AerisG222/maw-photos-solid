import { MarginIdType, defaultMargin } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSize } from '../thumbnail-size';

export type CategoryListViewSettingsState = {
    readonly margin: MarginIdType;
    readonly thumbnailSize: ThumbnailSizeIdType;
};

export const defaultCategoryListViewSettings: CategoryListViewSettingsState = {
    margin: defaultMargin,
    thumbnailSize: defaultThumbnailSize,
};
