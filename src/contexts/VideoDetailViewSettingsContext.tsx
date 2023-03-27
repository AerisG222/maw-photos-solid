import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { VideoDetailViewSettingsState, defaultVideoDetailViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';
import { VideoSize } from '../models/video-size';
import { KEY_SETTINGS_VIDEO_VIEW_DETAIL, loadJson, saveJson } from './_storage';

export type VideoDetailViewSettingsContextValue = [
    state: VideoDetailViewSettingsState,
    actions: {
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
        setShowVideoList: (showVideoList: boolean) => void;
        setVideoSize: (videoSize: VideoSize) => void;
    }
];

const VideoDetailViewSettingsContext = createContext<VideoDetailViewSettingsContextValue>([
    defaultVideoDetailViewSettings,
    {
        setShowBreadcrumbs: () => undefined,
        setThumbnailSize: () => undefined,
        setShowVideoList: () => undefined,
        setVideoSize: () => undefined,
    }
]);

export const VideoDetailSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => updateState({showBreadcrumbs: showBreadcrumbs});
    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => updateState({thumbnailSize: thumbnailSize});
    const setShowVideoList = (showVideoList: boolean) => updateState({showVideoList: showVideoList});
    const setVideoSize = (videoSize: VideoSize) => updateState({videoSize: videoSize});

    const updateState = (update: Partial<VideoDetailViewSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <VideoDetailViewSettingsContext.Provider value={[state, {
            setShowBreadcrumbs,
            setThumbnailSize,
            setShowVideoList,
            setVideoSize
        }]}>
            {props.children}
        </VideoDetailViewSettingsContext.Provider>
    );
}

export const useVideoDetailViewSettings = () => useContext(VideoDetailViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_VIDEO_VIEW_DETAIL, defaultVideoDetailViewSettings);
}

function saveState(state: VideoDetailViewSettingsState) {
    saveJson(KEY_SETTINGS_VIDEO_VIEW_DETAIL, state);
}
