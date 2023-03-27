import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MapType } from '../models/map-type';
import { VideoInfoPanelSettingsState, defaultVideoInfoPanelSettings } from '../models/settings';
import { KEY_SETTINGS_VIDEO_INFO_PANEL, loadJson, saveJson } from './_storage';

export type VideoInfoPanelSettingsContextValue = [
    state: VideoInfoPanelSettingsState,
    actions: {
        setShowRatings: (showRatings: boolean) => void;
        setShowCategoryTeaserChooser: (showCategoryTeaserChooser: boolean) => void;
        setShowComments: (showComments: boolean) => void;
        setShowMetadataEditor: (showMetadataEditor: boolean) => void;
        setShowMinimap: (showMinimap: boolean) => void;
        setExpandedState: (showExpandedState: boolean) => void;
        setMinimapZoom: (minimapZoom: number) => void;
        setMinimapMapType: (minimapMapType: MapType) => void;
    }
];

const VideoInfoPanelSettingsContext = createContext<VideoInfoPanelSettingsContextValue>([
    defaultVideoInfoPanelSettings,
    {
        setShowRatings: () => undefined,
        setShowCategoryTeaserChooser: () => undefined,
        setShowComments: () => undefined,
        setShowMetadataEditor: () => undefined,
        setShowMinimap: () => undefined,
        setExpandedState: () => undefined,
        setMinimapZoom: () => undefined,
        setMinimapMapType: () => undefined,
    }
]);

export const VideoInfoPanelSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadVideoInfoPanelSettings());

    const setShowRatings = (showRatings: boolean) => updateState({showRatings: showRatings});
    const setShowCategoryTeaserChooser = (showCategoryTeaserChooser: boolean) => updateState({showCategoryTeaserChooser: showCategoryTeaserChooser});
    const setShowComments = (showComments: boolean) => updateState({showComments: showComments});
    const setShowMetadataEditor = (showMetadataEditor: boolean) => updateState({showMetadataEditor: showMetadataEditor});
    const setShowMinimap = (showMinimap: boolean) => updateState({showMinimap: showMinimap});
    const setExpandedState = (expandedState: boolean) => updateState({expandedState: expandedState});
    const setMinimapZoom = (minimapZoom: number) => updateState({minimapZoom: minimapZoom});
    const setMinimapMapType = (minimapMapType: MapType) => updateState({minimapMapType: minimapMapType});

    const updateState = (update: Partial<VideoInfoPanelSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <VideoInfoPanelSettingsContext.Provider value={[state, {
            setShowRatings,
            setShowCategoryTeaserChooser,
            setShowComments,
            setShowMetadataEditor,
            setShowMinimap,
            setExpandedState,
            setMinimapZoom,
            setMinimapMapType
        }]}>
            {props.children}
        </VideoInfoPanelSettingsContext.Provider>
    );
}

export const useVideoInfoPanelSettings = () => useContext(VideoInfoPanelSettingsContext);

function loadVideoInfoPanelSettings() {
    return loadJson(KEY_SETTINGS_VIDEO_INFO_PANEL, defaultVideoInfoPanelSettings);
}

function saveState(state: VideoInfoPanelSettingsState) {
    saveJson(KEY_SETTINGS_VIDEO_INFO_PANEL, state);
}
