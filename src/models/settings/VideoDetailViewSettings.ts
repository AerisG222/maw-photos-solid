import { ThumbnailSizeIdType, defaultThumbnailSizeId } from '../thumbnail-size';
import { VideoSizeIdType, defaultVideoSizeId } from '../video-size';

export type VideoDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSizeId: ThumbnailSizeIdType;
    showVideoList: boolean;
    videoSizeId: VideoSizeIdType;
};

export const defaultVideoDetailViewSettings: VideoDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSizeId: defaultThumbnailSizeId,
    showVideoList: true,
    videoSizeId: defaultVideoSizeId,
};
