import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { defaultMapType, MapTypeIdType } from '../../_models/MapType';
import { KEY_SETTINGS_PHOTO_VIEW_MAP, loadJson, saveJson } from './_storage';
import { defaultMapZoomLevel, MapZoomLevelIdType } from '../../_models/MapZoomLevel';

export type PhotoMapViewSettingsState = {
    mapType: MapTypeIdType;
    zoom: MapZoomLevelIdType;
};

export const defaultPhotoMapViewSettings: PhotoMapViewSettingsState = {
    mapType: defaultMapType,
    zoom: defaultMapZoomLevel,
};

export type PhotoMapViewSettingsContextValue = [
    state: PhotoMapViewSettingsState,
    actions: {
        setMapType: (mapType: MapTypeIdType) => void;
        setZoom: (zoom: MapZoomLevelIdType) => void;
    }
];

const PhotoMapViewSettingsContext = createContext<PhotoMapViewSettingsContextValue>();

export const PhotoMapSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setMapType = (mapType: MapTypeIdType) => updateState({mapType: mapType});
    const setZoom = (zoom: MapZoomLevelIdType) => updateState({zoom: zoom});

    const updateState = (update: Partial<PhotoMapViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <PhotoMapViewSettingsContext.Provider value={[state, { setMapType, setZoom }]}>
            {props.children}
        </PhotoMapViewSettingsContext.Provider>
    );
};

export const usePhotoMapViewSettingsContext = () => useContext(PhotoMapViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_PHOTO_VIEW_MAP, defaultPhotoMapViewSettings);
}

function saveState(state: PhotoMapViewSettingsState) {
    saveJson(KEY_SETTINGS_PHOTO_VIEW_MAP, state);
}
