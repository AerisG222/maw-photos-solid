import { MapTypeIdType, defaultMapTypeId } from '../map-type';
import { MapZoomLevelIdType, defaultMapZoomLevelId } from '../map-zoom-level';

export type PhotoMapViewSettingsState = {
    mapTypeId: MapTypeIdType;
    zoomId: MapZoomLevelIdType;
};

export const defaultPhotoMapViewSettings: PhotoMapViewSettingsState = {
    mapTypeId: defaultMapTypeId,
    zoomId: defaultMapZoomLevelId,
};
