import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMapType, MapTypeIdType } from "../../_models/MapType";
import { KEY_SETTINGS_MEDIA_INFO_PANEL, loadJson, saveJson } from "./_storage";
import { defaultMapZoomLevel, MapZoomLevelIdType } from "../../_models/MapZoomLevel";

export type MediaInfoPanelSettingsState = {
    expandInfoPanel: boolean;
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

export const defaultMediaInfoPanelSettings: MediaInfoPanelSettingsState = {
    expandInfoPanel: false,
    showCategoryTeaserChooser: false,
    showComments: true,
    showExif: false,
    showEffects: false,
    showHistogram: false,
    showMetadataEditor: false,
    showMinimap: false,
    minimapMapType: defaultMapType,
    minimapZoom: defaultMapZoomLevel
};

export type MediaInfoPanelSettingsContextValue = [
    state: MediaInfoPanelSettingsState,
    actions: {
        setExpandInfoPanel: (expandInfoPanel: boolean) => void;
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

const MediaInfoPanelSettingsContext = createContext<MediaInfoPanelSettingsContextValue>();

export const MediaInfoPanelSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setExpandInfoPanel = (expandInfoPanel: boolean) => updateState({ expandInfoPanel });
    const setShowCategoryTeaserChooser = (showCategoryTeaserChooser: boolean) =>
        updateState({ showCategoryTeaserChooser });
    const setShowComments = (showComments: boolean) => updateState({ showComments });
    const setShowExif = (showExif: boolean) => updateState({ showExif });
    const setShowEffects = (showEffects: boolean) => updateState({ showEffects });
    const setShowMetadataEditor = (showMetadataEditor: boolean) =>
        updateState({ showMetadataEditor });
    const setShowHistogram = (showHistogram: boolean) => updateState({ showHistogram });
    const setShowMinimap = (showMinimap: boolean) => updateState({ showMinimap });
    const setMinimapZoom = (minimapZoom: MapZoomLevelIdType) => updateState({ minimapZoom });
    const setMinimapMapType = (minimapMapType: MapTypeIdType) => updateState({ minimapMapType });

    const updateState = (update: Partial<MediaInfoPanelSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <MediaInfoPanelSettingsContext.Provider
            value={[
                state,
                {
                    setExpandInfoPanel,
                    setShowCategoryTeaserChooser,
                    setShowComments,
                    setShowExif,
                    setShowEffects,
                    setShowMetadataEditor,
                    setShowHistogram,
                    setShowMinimap,
                    setMinimapZoom,
                    setMinimapMapType
                }
            ]}
        >
            {props.children}
        </MediaInfoPanelSettingsContext.Provider>
    );
};

export const useMediaInfoPanelSettingsContext = () => {
    const ctx = useContext(MediaInfoPanelSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("MediaInfoPanelSettings context not provided by ancestor component!");
};

function loadState() {
    return loadJson(KEY_SETTINGS_MEDIA_INFO_PANEL, defaultMediaInfoPanelSettings);
}

function saveState(state: MediaInfoPanelSettingsState) {
    saveJson(KEY_SETTINGS_MEDIA_INFO_PANEL, state);
}
