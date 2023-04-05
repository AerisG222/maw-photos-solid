import { KeyValuePair } from './key-value-pair';

export type MapZoomLevelIdType = number;
export type MapZoomLevel = KeyValuePair<MapZoomLevelIdType>;

export const allMapZoomLevels: MapZoomLevel[] = [
    { id: 1,  name: '1 - World' },
    { id: 2,  name: '2' },
    { id: 3,  name: '3' },
    { id: 4,  name: '4' },
    { id: 5,  name: '5 - Landmass/continent' },
    { id: 6,  name: '6' },
    { id: 7,  name: '7' },
    { id: 8,  name: '8' },
    { id: 9,  name: '9' },
    { id: 10, name: '10 - City' },
    { id: 11, name: '11' },
    { id: 12, name: '12' },
    { id: 13, name: '13' },
    { id: 14, name: '14' },
    { id: 15, name: '15 - Streets' },
    { id: 16, name: '16' },
    { id: 17, name: '17' },
    { id: 18, name: '18' },
    { id: 19, name: '19' },
    { id: 20, name: '20 - Buildings' },
    { id: 21, name: '21' },
    { id: 22, name: '22' },
];

export const defaultMapZoomLevel: MapZoomLevelIdType = 10;
