import { ValueDescriptor } from './value-descriptor';

export enum MapType {
    roadmap = 'roadmap',
    hybrid = 'hybrid',
    satellite = 'satellite',
    terrain = 'terrain',
}

export const allMapTypes: ValueDescriptor<MapType>[] = [
    { value: MapType.roadmap, name: 'Roadmap' },
    { value: MapType.hybrid, name: 'Hybrid' },
    { value: MapType.satellite, name: 'Satellite' },
    { value: MapType.terrain, name: 'Terrain' },
];

export const toMapType = (val?: string | null): MapType | undefined => {
    if (!val) {
        return undefined;
    }

    return MapType[val as keyof typeof MapType];
};
