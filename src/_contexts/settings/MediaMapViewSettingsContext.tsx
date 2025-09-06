import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMapType, MapTypeIdType } from "../../_models/MapType";
import { KEY_SETTINGS_MEDIA_VIEW_MAP, loadJson, saveJson } from "./_storage";
import { defaultMapZoomLevel, MapZoomLevelIdType } from "../../_models/MapZoomLevel";

export interface MediaMapViewSettingsState {
    mapType: MapTypeIdType;
    zoom: MapZoomLevelIdType;
}

export const defaultMediaMapViewSettings: MediaMapViewSettingsState = {
    mapType: defaultMapType,
    zoom: defaultMapZoomLevel
};

export type MediaMapViewSettingsContextValue = [
    state: MediaMapViewSettingsState,
    actions: {
        setMapType: (mapType: MapTypeIdType) => void;
        setZoom: (zoom: MapZoomLevelIdType) => void;
    }
];

const MediaMapViewSettingsContext = createContext<MediaMapViewSettingsContextValue>();

export const MediaMapSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setMapType = (mapType: MapTypeIdType) => updateState({ mapType });
    const setZoom = (zoom: MapZoomLevelIdType) => updateState({ zoom });

    const updateState = (update: Partial<MediaMapViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <MediaMapViewSettingsContext.Provider value={[state, { setMapType, setZoom }]}>
            {props.children}
        </MediaMapViewSettingsContext.Provider>
    );
};

export const useMediaMapViewSettingsContext = () => {
    const ctx = useContext(MediaMapViewSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("MediaMapViewSettings context not provided by ancestor component!");
};

function loadState() {
    return loadJson(KEY_SETTINGS_MEDIA_VIEW_MAP, defaultMediaMapViewSettings);
}

function saveState(state: MediaMapViewSettingsState) {
    saveJson(KEY_SETTINGS_MEDIA_VIEW_MAP, state);
}
