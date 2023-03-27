import { MapType } from '../map-type';

export type PhotoMapViewSettingsState = {
    mapType: MapType;
    zoom: number;
};

export const defaultPhotoMapViewSettings: PhotoMapViewSettingsState = {
    mapType: MapType.roadmap,
    zoom: 10,
};
