import { MarginIdType, defaultMargin } from '../Margin';
import { ThumbnailSizeIdType, defaultGridThumbnailSize } from '../ThumbnailSize';

export type RandomGridViewSettingsState = {
    marginId: MarginIdType;
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
};

export const defaultRandomGridViewSettings: RandomGridViewSettingsState = {
    marginId: defaultMargin,
    showBreadcrumbs: true,
    thumbnailSize: defaultGridThumbnailSize,
};
