import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { VideoDetailViewSettingsState, defaultVideoDetailViewSettings, loadVideoDetailViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';
import { VideoSize } from '../models/video-size';

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
    const [state, setState] = createStore(loadVideoDetailViewSettings());

    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => {
        setState({showBreadcrumbs: showBreadcrumbs});
    }

    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => {
        setState({thumbnailSize: thumbnailSize});
    }

    const setShowVideoList = (showVideoList: boolean) => {
        setState({showVideoList: showVideoList});
    }

    const setVideoSize = (videoSize: VideoSize) => {
        setState({videoSize: videoSize});
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
