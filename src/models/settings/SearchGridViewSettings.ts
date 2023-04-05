import { MarginIdType, defaultMargin } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSize } from '../thumbnail-size';

export type SearchGridViewSettingsState = {
    margin: MarginIdType;
    showTitles: boolean;
    showYears: boolean;
    thumbnailSize: ThumbnailSizeIdType;
};

export const defaultSearchGridViewSettings: SearchGridViewSettingsState = {
    margin: defaultMargin,
    showTitles: true,
    showYears: true,
    thumbnailSize: defaultThumbnailSize,
};
