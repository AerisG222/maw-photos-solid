import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MapTypeIdType } from '../models/MapType';
import { VideoInfoPanelSettingsState, defaultVideoInfoPanelSettings } from '../models/settings';
import { KEY_SETTINGS_VIDEO_INFO_PANEL, loadJson, saveJson } from './_storage';
import { MapZoomLevelIdType } from '../models/MapZoomLevel';

export type VideoInfoPanelSettingsContextValue = [
    state: VideoInfoPanelSettingsState,
    actions: {
        setExpandInfoPanel: (expandInfoPanel: boolean) => void;
        setShowRatings: (showRatings: boolean) => void;
        setShowCategoryTeaserChooser: (showCategoryTeaserChooser: boolean) => void;
        setShowComments: (showComments: boolean) => void;
        setShowMetadataEditor: (showMetadataEditor: boolean) => void;
        setShowMinimap: (showMinimap: boolean) => void;
        setMinimapZoom: (minimapZoom: MapZoomLevelIdType) => void;
        setMinimapMapType: (minimapMapType: MapTypeIdType) => void;
    }
];

const VideoInfoPanelSettingsContext = createContext<VideoInfoPanelSettingsContextValue>([
    defaultVideoInfoPanelSettings,
    {
        setExpandInfoPanel: () => undefined,
        setShowRatings: () => undefined,
        setShowCategoryTeaserChooser: () => undefined,
        setShowComments: () => undefined,
        setShowMetadataEditor: () => undefined,
        setShowMinimap: () => undefined,
        setMinimapZoom: () => undefined,
        setMinimapMapType: () => undefined,
    }
]);

export const VideoInfoPanelSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadVideoInfoPanelSettings());

    const setExpandInfoPanel = (expandInfoPanel: boolean) => updateState({expandInfoPanel: expandInfoPanel});
    const setShowRatings = (showRatings: boolean) => updateState({showRatings: showRatings});
    const setShowCategoryTeaserChooser = (showCategoryTeaserChooser: boolean) => updateState({showCategoryTeaserChooser: showCategoryTeaserChooser});
    const setShowComments = (showComments: boolean) => updateState({showComments: showComments});
    const setShowMetadataEditor = (showMetadataEditor: boolean) => updateState({showMetadataEditor: showMetadataEditor});
    const setShowMinimap = (showMinimap: boolean) => updateState({showMinimap: showMinimap});
    const setMinimapZoom = (minimapZoom: MapZoomLevelIdType) => updateState({minimapZoom: minimapZoom});
    const setMinimapMapType = (minimapMapType: MapTypeIdType) => updateState({minimapMapType: minimapMapType});

    const updateState = (update: Partial<VideoInfoPanelSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <VideoInfoPanelSettingsContext.Provider value={[state, {
            setExpandInfoPanel,
            setShowRatings,
            setShowCategoryTeaserChooser,
            setShowComments,
            setShowMetadataEditor,
            setShowMinimap,
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
