import { MarginIdType, defaultMarginId } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSizeId } from '../thumbnail-size';

export type SearchGridViewSettingsState = {
    marginId: MarginIdType;
    showTitles: boolean;
    showYears: boolean;
    thumbnailSizeId: ThumbnailSizeIdType;
};

export const defaultSearchGridViewSettings: SearchGridViewSettingsState = {
    marginId: defaultMarginId,
    showTitles: true,
    showYears: true,
    thumbnailSizeId: defaultThumbnailSizeId,
};
