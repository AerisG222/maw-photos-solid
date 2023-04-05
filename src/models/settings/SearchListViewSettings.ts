import { MarginIdType, defaultMargin } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSize } from '../thumbnail-size';

export type SearchListViewSettingsState = {
    readonly margin: MarginIdType;
    readonly thumbnailSize: ThumbnailSizeIdType;
};

export const defaultSearchListViewSettings: SearchListViewSettingsState = {
    margin: defaultMargin,
    thumbnailSize: defaultThumbnailSize,
};
