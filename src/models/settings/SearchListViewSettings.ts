import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';

export type SearchListViewSettingsState = {
    readonly margin: Margin;
    readonly thumbnailSize: ThumbnailSize;
};

export const defaultSearchListViewSettings: SearchListViewSettingsState = {
    margin: Margin.dense,
    thumbnailSize: ThumbnailSize.default,
};
