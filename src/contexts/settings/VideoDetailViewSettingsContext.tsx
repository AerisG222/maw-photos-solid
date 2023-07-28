import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { VideoDetailViewSettingsState, defaultVideoDetailViewSettings } from '../../_models/settings';
import { ThumbnailSizeIdType } from '../../_models/ThumbnailSize';
import { KEY_SETTINGS_VIDEO_VIEW_DETAIL, loadJson, saveJson } from './_storage';

export type VideoDetailViewSettingsContextValue = [
    state: VideoDetailViewSettingsState,
    actions: {
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setShowVideoList: (showVideoList: boolean) => void;
    }
];

const VideoDetailViewSettingsContext = createContext<VideoDetailViewSettingsContextValue>();

export const VideoDetailSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => updateState({showBreadcrumbs: showBreadcrumbs});
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({thumbnailSize: thumbnailSize});
    const setShowVideoList = (showVideoList: boolean) => updateState({showVideoList: showVideoList});

    const updateState = (update: Partial<VideoDetailViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <VideoDetailViewSettingsContext.Provider value={[state, {
            setShowBreadcrumbs,
            setThumbnailSize,
            setShowVideoList
        }]}>
            {props.children}
        </VideoDetailViewSettingsContext.Provider>
    );
};

export const useVideoDetailViewSettingsContext = () => useContext(VideoDetailViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_VIDEO_VIEW_DETAIL, defaultVideoDetailViewSettings);
}

function saveState(state: VideoDetailViewSettingsState) {
    saveJson(KEY_SETTINGS_VIDEO_VIEW_DETAIL, state);
}
