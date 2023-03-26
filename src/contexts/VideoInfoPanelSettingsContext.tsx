import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MapType } from '../models/map-type';
import { VideoInfoPanelSettingsState, defaultVideoInfoPanelSettings, loadVideoInfoPanelSettings } from '../models/settings';

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

    const setShowRatings = (showRatings: boolean) => {
        setState({showRatings: showRatings});
    }

    const setShowCategoryTeaserChooser = (showCategoryTeaserChooser: boolean) => {
        setState({showCategoryTeaserChooser: showCategoryTeaserChooser});
    }

    const setShowComments = (showComments: boolean) => {
        setState({showComments: showComments});
    }

    const setShowMetadataEditor = (showMetadataEditor: boolean) => {
        setState({showMetadataEditor: showMetadataEditor});
    }

    const setShowMinimap = (showMinimap: boolean) => {
        setState({showMinimap: showMinimap});
    }

    const setExpandedState = (expandedState: boolean) => {
        setState({expandedState: expandedState});
    }

    const setMinimapZoom = (minimapZoom: number) => {
        setState({minimapZoom: minimapZoom});
    }

    const setMinimapMapType = (minimapMapType: MapType) => {
        setState({minimapMapType: minimapMapType});
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
