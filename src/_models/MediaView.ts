import { KeyValuePair } from "./KeyValuePair";

export const MediaViewBulkEdit = "bulk-edit";
export const MediaViewFullscreen = "fullscreen";
export const MediaViewGrid = "grid";
export const MediaViewMap = "map";

export type MediaView =
    | typeof MediaViewBulkEdit
    | typeof MediaViewFullscreen
    | typeof MediaViewGrid
    | typeof MediaViewMap;

export const MediaViewAll: MediaView[] = [
    MediaViewBulkEdit,
    MediaViewFullscreen,
    MediaViewGrid,
    MediaViewMap
];

export type MediaViewOption = KeyValuePair<MediaView>;

export const allMediaViews: MediaViewOption[] = [
    { id: MediaViewBulkEdit, name: "Bulk Edit" },
    { id: MediaViewFullscreen, name: "Fullscreen" },
    { id: MediaViewGrid, name: "Grid" },
    { id: MediaViewMap, name: "Map" }
];

export const defaultMediaView: MediaView = MediaViewGrid;
