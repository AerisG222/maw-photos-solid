import { MarginIdType, defaultMargin } from '../margin';
import { ThumbnailSizeIdType, defaultThumbnailSize } from '../thumbnail-size';

export type RandomGridViewSettingsState = {
    marginId: MarginIdType;
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
};

export const defaultRandomGridViewSettings: RandomGridViewSettingsState = {
    marginId: defaultMargin,
    showBreadcrumbs: true,
    thumbnailSize: defaultThumbnailSize,
};
