import { MarginIdType, defaultMargin } from '../Margin';
import { ThumbnailSizeIdType, defaultThumbnailSize } from '../ThumbnailSize';

export type SearchListViewSettingsState = {
    readonly margin: MarginIdType;
    readonly thumbnailSize: ThumbnailSizeIdType;
};

export const defaultSearchListViewSettings: SearchListViewSettingsState = {
    margin: defaultMargin,
    thumbnailSize: defaultThumbnailSize,
};
