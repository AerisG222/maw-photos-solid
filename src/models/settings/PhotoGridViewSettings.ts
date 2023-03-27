import { Margin } from '../margin';
import { ThumbnailSize } from '../thumbnail-size';

export type PhotoGridViewSettingsState = {
    margin: Margin;
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSize;
};

export const defaultPhotoGridViewSettings: PhotoGridViewSettingsState = {
    margin: Margin.dense,
    showBreadcrumbs: true,
    thumbnailSize: ThumbnailSize.default,
};
