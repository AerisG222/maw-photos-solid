import { MarginIdType, defaultMargin } from '../Margin';
import { ThumbnailSizeIdType, defaultGridThumbnailSize } from '../ThumbnailSize';

export type PhotoGridViewSettingsState = {
    margin: MarginIdType;
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
};

export const defaultPhotoGridViewSettings: PhotoGridViewSettingsState = {
    margin: defaultMargin,
    showBreadcrumbs: true,
    thumbnailSize: defaultGridThumbnailSize,
};
