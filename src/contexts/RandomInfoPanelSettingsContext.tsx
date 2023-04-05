import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MapTypeIdType } from '../models/map-type';
import { RandomInfoPanelSettingsState, defaultRandomInfoPanelSettings } from '../models/settings';
import { KEY_SETTINGS_RANDOM_INFO_PANEL, loadJson, saveJson } from './_storage';
import { MapZoomLevelIdType } from '../models/map-zoom-level';

export type RandomInfoPanelSettingsContextValue = [
    state: RandomInfoPanelSettingsState,
    actions: {
        setExpandInfoPanel: (expandInfoPanel: boolean) => void;
        setShowRatings: (showRatings: boolean) => void;
        setShowCategoryTeaserChooser: (showCategoryTeaserChooser: boolean) => void;
        setShowComments: (showComments: boolean) => void;
        setShowExif: (showExif: boolean) => void;
        setShowEffects: (showEffects: boolean) => void;
        setShowMetadataEditor: (showMetadataEditor: boolean) => void;
        setShowHistogram: (showHistogram: boolean) => void;
        setShowMinimap: (showMinimap: boolean) => void;
        setMinimapZoom: (minimapZoomId: MapZoomLevelIdType) => void;
        setMinimapMapType: (minimapMapTypeId: MapTypeIdType) => void;
    }
];

const RandomInfoPanelSettingsContext = createContext<RandomInfoPanelSettingsContextValue>([
    defaultRandomInfoPanelSettings,
    {
        setExpandInfoPanel: () => undefined,
        setShowRatings: () => undefined,
        setShowCategoryTeaserChooser: () => undefined,
        setShowComments: () => undefined,
        setShowExif: () => undefined,
        setShowEffects: () => undefined,
        setShowMetadataEditor: () => undefined,
        setShowHistogram: () => undefined,
        setShowMinimap: () => undefined,
        setMinimapZoom: () => undefined,
        setMinimapMapType: () => undefined,
    }
]);

export const RandomInfoPanelSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setExpandInfoPanel = (expandedInfoPanel: boolean) => updateState({expandInfoPanel: expandedInfoPanel});
    const setShowRatings = (showRatings: boolean) => updateState({showRatings: showRatings});
    const setShowCategoryTeaserChooser = (showCategoryTeaserChooser: boolean) => updateState({showCategoryTeaserChooser: showCategoryTeaserChooser});
    const setShowComments = (showComments: boolean) => updateState({showComments: showComments});
    const setShowExif = (showExif: boolean) => updateState({showExif: showExif});
    const setShowEffects = (showEffects: boolean) => updateState({showEffects: showEffects});
    const setShowMetadataEditor = (showMetadataEditor: boolean) => updateState({showMetadataEditor: showMetadataEditor});
    const setShowHistogram = (showHistogram: boolean) => updateState({showHistogram: showHistogram});
    const setShowMinimap = (showMinimap: boolean) => updateState({showMinimap: showMinimap});
    const setMinimapZoom = (minimapZoom: MapZoomLevelIdType) => updateState({minimapZoom: minimapZoom});
    const setMinimapMapType = (minimapMapType: MapTypeIdType) => updateState({minimapMapType: minimapMapType});

    const updateState = (update: Partial<RandomInfoPanelSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <RandomInfoPanelSettingsContext.Provider value={[state, {
            setExpandInfoPanel,
            setShowRatings,
            setShowCategoryTeaserChooser,
            setShowComments,
            setShowExif,
            setShowEffects,
            setShowMetadataEditor,
            setShowHistogram,
            setShowMinimap,
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
