import { KeyValuePair } from "./KeyValuePair";

export type MediaViewIdType = string;
export type MediaView = KeyValuePair<MediaViewIdType>;

export const allMediaViews: MediaView[] = [
    { id: "bulkEdit", name: "Bulk Edit" },
    { id: "detail", name: "Detail" },
    { id: "fullscreen", name: "Fullscreen" },
    { id: "grid", name: "Grid" },
    { id: "map", name: "Map" }
];

export const defaultMediaView: MediaViewIdType = "grid";
