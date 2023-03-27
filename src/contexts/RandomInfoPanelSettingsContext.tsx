import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MapType } from '../models/map-type';
import { RandomInfoPanelSettingsState, defaultRandomInfoPanelSettings } from '../models/settings';
import { KEY_SETTINGS_RANDOM_INFO_PANEL, loadJson, saveJson } from './_storage';

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
    const [state, setState] = createStore(loadState());

    const setShowRatings = (showRatings: boolean) => updateState({showRatings: showRatings});
    const setShowCategoryTeaserChooser = (showCategoryTeaserChooser: boolean) => updateState({showCategoryTeaserChooser: showCategoryTeaserChooser});
    const setShowComments = (showComments: boolean) => updateState({showComments: showComments});
    const setShowExif = (showExif: boolean) => updateState({showExif: showExif});
    const setShowEffects = (showEffects: boolean) => updateState({showEffects: showEffects});
    const setShowMetadataEditor = (showMetadataEditor: boolean) => updateState({showMetadataEditor: showMetadataEditor});
    const setShowHistogram = (showHistogram: boolean) => updateState({showHistogram: showHistogram});
    const setShowMinimap = (showMinimap: boolean) => updateState({showMinimap: showMinimap});
    const setExpandedState = (expandedState: boolean) => updateState({expandedState: expandedState});
    const setMinimapZoom = (minimapZoom: number) => updateState({minimapZoom: minimapZoom});
    const setMinimapMapType = (minimapMapType: MapType) => updateState({minimapMapType: minimapMapType});

    const updateState = (update: Partial<RandomInfoPanelSettingsState>) => {
        setState(update);
        saveState(state);
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

function loadState() {
    return loadJson(KEY_SETTINGS_RANDOM_INFO_PANEL, defaultRandomInfoPanelSettings);
}

function saveState(state: RandomInfoPanelSettingsState) {
    saveJson(KEY_SETTINGS_RANDOM_INFO_PANEL, state);
}
