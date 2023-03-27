import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';

export type CategoryListViewSettingsState = {
    readonly margin: Margin;
    readonly thumbnailSize: ThumbnailSize;
};

export const defaultCategoryListViewSettings: CategoryListViewSettingsState = {
    margin: Margin.dense,
    thumbnailSize: ThumbnailSize.default,
};
