import { MapTypeIdType, defaultMapType } from '../MapType';
import { MapZoomLevelIdType, defaultMapZoomLevel } from '../MapZoomLevel';

export type PhotoMapViewSettingsState = {
    mapType: MapTypeIdType;
    zoom: MapZoomLevelIdType;
};

export const defaultPhotoMapViewSettings: PhotoMapViewSettingsState = {
    mapType: defaultMapType,
    zoom: defaultMapZoomLevel,
};
