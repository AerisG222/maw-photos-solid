import { MarginIdType, defaultMargin } from '../Margin';
import { ThumbnailSizeIdType, defaultThumbnailSize } from '../ThumbnailSize';

export type CategoryGridViewSettingsState = {
    readonly margin: MarginIdType;
    readonly showTitles: boolean;
    readonly thumbnailSize: ThumbnailSizeIdType;
};

export const defaultCategoryGridViewSettings: CategoryGridViewSettingsState = {
    margin: defaultMargin,
    showTitles: true,
    thumbnailSize: defaultThumbnailSize,
};
