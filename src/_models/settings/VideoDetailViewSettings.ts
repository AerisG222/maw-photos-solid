import { ThumbnailSizeIdType, defaultGridThumbnailSize } from '../ThumbnailSize';

export type VideoDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    showVideoList: boolean;
};

export const defaultVideoDetailViewSettings: VideoDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: defaultGridThumbnailSize,
    showVideoList: true,
};
