import { ThumbnailSize } from '../thumbnail-size';
import { VideoSize } from '../video-size';

export type VideoDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSize;
    showVideoList: boolean;
    videoSize: VideoSize;
};

export const defaultVideoDetailViewSettings: VideoDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: ThumbnailSize.default,
    showVideoList: true,
    videoSize: VideoSize.small,
};
