import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MapType } from '../models/map-type';
import { PhotoMapViewSettingsState, defaultPhotoMapViewSettings, loadPhotoMapViewSettings } from '../models/settings';

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
    const [state, setState] = createStore(loadPhotoMapViewSettings());

    const setMapType = (mapType: MapType) => {
        setState({mapType: mapType});
    };

    const setZoom = (zoom: number) => {
        setState({zoom: zoom});
    }

    return (
        <PhotoMapViewSettingsContext.Provider value={[state, { setMapType, setZoom }]}>
            {props.children}
        </PhotoMapViewSettingsContext.Provider>
    );
}

export const usePhotoMapViewSettings = () => useContext(PhotoMapViewSettingsContext);
