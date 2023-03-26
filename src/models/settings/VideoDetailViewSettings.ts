import { ThumbnailSize } from '../thumbnail-size';
import { VideoSize } from '../video-size';
import { KEY_SETTINGS_VIDEO_VIEW_DETAIL, loadJson } from './storage';

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

export function loadVideoDetailViewSettings() {
    return loadJson(KEY_SETTINGS_VIDEO_VIEW_DETAIL, defaultVideoDetailViewSettings);
}
