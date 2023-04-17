import { MarginIdType, defaultMargin } from '../Margin';
import { ThumbnailSizeIdType, defaultListThumbnailSize } from '../ThumbnailSize';

export type CategoryListViewSettingsState = {
    readonly margin: MarginIdType;
    readonly thumbnailSize: ThumbnailSizeIdType;
};

export const defaultCategoryListViewSettings: CategoryListViewSettingsState = {
    margin: defaultMargin,
    thumbnailSize: defaultListThumbnailSize,
};
