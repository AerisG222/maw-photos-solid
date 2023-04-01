import { MarginIdType, defaultMarginId } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSizeId } from '../thumbnail-size';

export type SearchListViewSettingsState = {
    readonly marginId: MarginIdType;
    readonly thumbnailSizeId: ThumbnailSizeIdType;
};

export const defaultSearchListViewSettings: SearchListViewSettingsState = {
    marginId: defaultMarginId,
    thumbnailSizeId: defaultThumbnailSizeId,
};
