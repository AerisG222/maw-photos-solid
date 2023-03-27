import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';

export type SearchGridViewSettingsState = {
    margin: Margin;
    showTitles: boolean;
    showYears: boolean;
    thumbnailSize: ThumbnailSize;
};

export const defaultSearchGridViewSettings: SearchGridViewSettingsState = {
    margin: Margin.dense,
    showTitles: true,
    showYears: true,
    thumbnailSize: ThumbnailSize.default,
};
