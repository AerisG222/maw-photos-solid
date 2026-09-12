/*
   An adapter, not a store.

   This preference now lives in one of the four stores beside this file; what
   remains here is the shape its callers already expect, so that consolidating
   the stores did not have to mean touching every screen at once. The callers
   move over in the steps that replace the toolbars, and then this file goes.
*/

import { MapTypeIdType } from "../../_models/MapType";
import { MapZoomLevelIdType } from "../../_models/MapZoomLevel";
import { useMediaSettingsContext } from "./MediaSettingsContext";

export interface MediaMapViewSettingsState {
    readonly mapType: MapTypeIdType;
    readonly zoom: MapZoomLevelIdType;
}

export type MediaMapViewSettingsContextValue = [
    state: MediaMapViewSettingsState,
    actions: {
        setMapType: (mapType: MapTypeIdType) => void;
        setZoom: (zoom: MapZoomLevelIdType) => void;
    }
];

export const useMediaMapViewSettingsContext = (): MediaMapViewSettingsContextValue => {
    const [media, mediaActions] = useMediaSettingsContext();

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: MediaMapViewSettingsState = {
        get mapType() {
            return media.mapType;
        },
        get zoom() {
            return media.mapZoom;
        }
    };

    return [
        state,
        {
            setMapType: type => mediaActions.setMapType(type),
            setZoom: zoom => mediaActions.setMapZoom(zoom)
        }
    ];
};
