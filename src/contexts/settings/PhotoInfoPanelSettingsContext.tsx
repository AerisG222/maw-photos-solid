import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { defaultMapType, MapTypeIdType } from '../../_models/MapType';
import { KEY_SETTINGS_MEDIA_INFO_PANEL, loadJson, saveJson } from './_storage';
import { defaultMapZoomLevel, MapZoomLevelIdType } from '../../_models/MapZoomLevel';

export type PhotoInfoPanelSettingsState = {
    expandInfoPanel: boolean;
    showRatings: boolean;
    showCategoryTeaserChooser: boolean;
    showComments: boolean;
    showExif: boolean;
    showEffects: boolean;
    showMetadataEditor: boolean;
    showHistogram: boolean;
    showMinimap: boolean;
    minimapZoom: MapZoomLevelIdType;
    minimapMapType: MapTypeIdType;
};

export const defaultPhotoInfoPanelSettings: PhotoInfoPanelSettingsState = {
    expandInfoPanel: false,
    showRatings: true,
    showCategoryTeaserChooser: false,
    showComments: true,
    showExif: false,
    showEffects: false,
    showHistogram: false,
    showMetadataEditor: false,
    showMinimap: false,
    minimapMapType: defaultMapType,
    minimapZoom: defaultMapZoomLevel,
};


export type PhotoInfoPanelSettingsContextValue = [
    state: PhotoInfoPanelSettingsState,
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
        setMinimapZoom: (minimapZoom: MapZoomLevelIdType) => void;
        setMinimapMapType: (minimapMapType: MapTypeIdType) => void;
    }
];

const PhotoInfoPanelSettingsContext = createContext<PhotoInfoPanelSettingsContextValue>();

export const PhotoInfoPanelSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setExpandInfoPanel = (expandInfoPanel: boolean) => updateState({expandInfoPanel: expandInfoPanel});
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

    const updateState = (update: Partial<PhotoInfoPanelSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <PhotoInfoPanelSettingsContext.Provider value={[state, {
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
        </PhotoInfoPanelSettingsContext.Provider>
    );
};

export const usePhotoInfoPanelSettingsContext = () => useContext(PhotoInfoPanelSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_MEDIA_INFO_PANEL, defaultPhotoInfoPanelSettings);
}

function saveState(state: PhotoInfoPanelSettingsState) {
    saveJson(KEY_SETTINGS_MEDIA_INFO_PANEL, state);
}
