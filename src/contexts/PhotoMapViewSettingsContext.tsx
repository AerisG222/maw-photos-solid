import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MapType } from '../models/map-type';
import { PhotoMapViewSettingsState, defaultPhotoMapViewSettings } from '../models/settings';
import { KEY_SETTINGS_PHOTO_VIEW_MAP, loadJson, saveJson } from './_storage';

export type PhotoMapViewSettingsContextValue = [
    state: PhotoMapViewSettingsState,
    actions: {
        setMapType: (mapType: MapType) => void;
        setZoom: (zoom: number) => void;
    }
];

const PhotoMapViewSettingsContext = createContext<PhotoMapViewSettingsContextValue>([
    defaultPhotoMapViewSettings,
    {
        setMapType: () => undefined,
        setZoom: () => undefined,
    }
]);

export const PhotoMapSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setMapType = (mapType: MapType) => updateState({mapType: mapType});
    const setZoom = (zoom: number) => updateState({zoom: zoom});

    const updateState = (update: Partial<PhotoMapViewSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <PhotoMapViewSettingsContext.Provider value={[state, { setMapType, setZoom }]}>
            {props.children}
        </PhotoMapViewSettingsContext.Provider>
    );
}

export const usePhotoMapViewSettings = () => useContext(PhotoMapViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_PHOTO_VIEW_MAP, defaultPhotoMapViewSettings);
}

function saveState(state: PhotoMapViewSettingsState) {
    saveJson(KEY_SETTINGS_PHOTO_VIEW_MAP, state);
}
