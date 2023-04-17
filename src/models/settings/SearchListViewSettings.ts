import { MarginIdType, defaultMargin } from '../Margin';
import { ThumbnailSizeIdType, defaultGridThumbnailSize } from '../ThumbnailSize';

export type SearchListViewSettingsState = {
    readonly margin: MarginIdType;
    readonly thumbnailSize: ThumbnailSizeIdType;
};

export const defaultSearchListViewSettings: SearchListViewSettingsState = {
    margin: defaultMargin,
    thumbnailSize: defaultGridThumbnailSize,
};
