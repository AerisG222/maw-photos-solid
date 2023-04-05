import { ThumbnailSizeIdType, defaultThumbnailSize } from '../thumbnail-size';
import { VideoSizeIdType, defaultVideoSize } from '../video-size';

export type VideoDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    showVideoList: boolean;
    videoSize: VideoSizeIdType;
};

export const defaultVideoDetailViewSettings: VideoDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: defaultThumbnailSize,
    showVideoList: true,
    videoSize: defaultVideoSize,
};
