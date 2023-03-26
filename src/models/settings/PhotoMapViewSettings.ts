import { MapType } from '../map-type';
import { KEY_SETTINGS_PHOTO_VIEW_MAP, loadJson } from './storage';

export type PhotoMapViewSettingsState = {
    mapType: MapType;
    zoom: number;
};

export const defaultPhotoMapViewSettings: PhotoMapViewSettingsState = {
    mapType: MapType.roadmap,
    zoom: 10,
};

export function loadPhotoMapViewSettings() {
    return loadJson(KEY_SETTINGS_PHOTO_VIEW_MAP, defaultPhotoMapViewSettings);
}
