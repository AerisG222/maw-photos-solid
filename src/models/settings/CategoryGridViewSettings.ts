import { MarginIdType, defaultMargin } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSize } from '../thumbnail-size';

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
