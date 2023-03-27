import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';

export type RandomGridViewSettingsState = {
    margin: Margin;
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSize;
};

export const defaultRandomGridViewSettings: RandomGridViewSettingsState = {
    margin: Margin.dense,
    showBreadcrumbs: true,
    thumbnailSize: ThumbnailSize.default,
};
