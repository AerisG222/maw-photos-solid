import { MapTypeIdType, defaultMapType } from '../map-type';
import { MapZoomLevelIdType, defaultMapZoomLevel } from '../map-zoom-level';

export type PhotoMapViewSettingsState = {
    mapType: MapTypeIdType;
    zoom: MapZoomLevelIdType;
};

export const defaultPhotoMapViewSettings: PhotoMapViewSettingsState = {
    mapType: defaultMapType,
    zoom: defaultMapZoomLevel,
};
