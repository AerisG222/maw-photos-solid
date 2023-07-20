import { MarginIdType, defaultMargin } from '../Margin';
import { ThumbnailSizeIdType, defaultGridThumbnailSize } from '../ThumbnailSize';

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
    thumbnailSize: defaultGridThumbnailSize,
};