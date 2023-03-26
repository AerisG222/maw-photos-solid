import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MapType } from '../models/map-type';
import { RandomInfoPanelSettingsState, defaultRandomInfoPanelSettings, loadRandomInfoPanelSettings } from '../models/settings';

export type RandomInfoPanelSettingsContextValue = [
    state: RandomInfoPanelSettingsState,
    actions: {
        setShowRatings: (showRatings: boolean) => void;
        setShowCategoryTeaserChooser: (showCategoryTeaserChooser: boolean) => void;
        setShowComments: (showComments: boolean) => void;
        setShowExif: (showExif: boolean) => void;
        setShowEffects: (showEffects: boolean) => void;
        setShowMetadataEditor: (showMetadataEditor: boolean) => void;
        setShowHistogram: (showHistogram: boolean) => void;
        setShowMinimap: (showMinimap: boolean) => void;
        setExpandedState: (showExpandedState: boolean) => void;
        setMinimapZoom: (minimapZoom: number) => void;
        setMinimapMapType: (minimapMapType: MapType) => void;
    }
];

const RandomInfoPanelSettingsContext = createContext<RandomInfoPanelSettingsContextValue>([
    defaultRandomInfoPanelSettings,
    {
        setShowRatings: () => undefined,
        setShowCategoryTeaserChooser: () => undefined,
        setShowComments: () => undefined,
        setShowExif: () => undefined,
        setShowEffects: () => undefined,
        setShowMetadataEditor: () => undefined,
        setShowHistogram: () => undefined,
        setShowMinimap: () => undefined,
        setExpandedState: () => undefined,
        setMinimapZoom: () => undefined,
        setMinimapMapType: () => undefined,
    }
]);

export const RandomInfoPanelSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadRandomInfoPanelSettings());

    const setShowRatings = (showRatings: boolean) => {
        setState({showRatings: showRatings});
    }

    const setShowCategoryTeaserChooser = (showCategoryTeaserChooser: boolean) => {
        setState({showCategoryTeaserChooser: showCategoryTeaserChooser});
    }

    const setShowComments = (showComments: boolean) => {
        setState({showComments: showComments});
    }

    const setShowExif = (showExif: boolean) => {
        setState({showExif: showExif});
    }

    const setShowEffects = (showEffects: boolean) => {
        setState({showEffects: showEffects});
    }

    const setShowMetadataEditor = (showMetadataEditor: boolean) => {
        setState({showMetadataEditor: showMetadataEditor});
    }

    const setShowHistogram = (showHistogram: boolean) => {
        setState({showHistogram: showHistogram});
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
        <RandomInfoPanelSettingsContext.Provider value={[state, {
            setShowRatings,
            setShowCategoryTeaserChooser,
            setShowComments,
            setShowExif,
            setShowEffects,
            setShowMetadataEditor,
            setShowHistogram,
            setShowMinimap,
            setExpandedState,
            setMinimapZoom,
            setMinimapMapType
        }]}>
            {props.children}
        </RandomInfoPanelSettingsContext.Provider>
    );
}

export const useRandomInfoPanelSettings = () => useContext(RandomInfoPanelSettingsContext);
