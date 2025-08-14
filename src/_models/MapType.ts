import { KeyValuePair } from "./KeyValuePair";

export type MapTypeIdType = string;
export type MapType = KeyValuePair<MapTypeIdType>;

export const allMapTypes: MapType[] = [
    { id: "roadmap", name: "Roadmap" },
    { id: "hybrid", name: "Hybrid" },
    { id: "satellite", name: "Satellite" },
    { id: "terrain", name: "Terrain" }
];

export const defaultMapType: MapTypeIdType = "satellite";
