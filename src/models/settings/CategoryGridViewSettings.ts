import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';

export type CategoryGridViewSettingsState = {
    readonly margin: Margin;
    readonly showTitles: boolean;
    readonly thumbnailSize: ThumbnailSize;
};

export const defaultCategoryGridViewSettings: CategoryGridViewSettingsState = {
    margin: Margin.dense,
    showTitles: true,
    thumbnailSize: ThumbnailSize.default,
};
