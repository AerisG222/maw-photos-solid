import { ThumbnailSizeIdType, defaultGridThumbnailSize } from '../ThumbnailSize';
import { VideoSizeIdType, defaultVideoSize } from '../VideoSize';

export type VideoDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    showVideoList: boolean;
    videoSize: VideoSizeIdType;
};

export const defaultVideoDetailViewSettings: VideoDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: defaultGridThumbnailSize,
    showVideoList: true,
    videoSize: defaultVideoSize,
};
