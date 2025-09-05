import { KeyValuePair } from './KeyValuePair';

export const MediaViewBulkEdit = "bulk-edit";
export const MediaViewDetail = "detail";
export const MediaViewFullscreen = "fullscreen";
export const MediaViewGrid = "grid";
export const MediaViewMap = "map";

export type MediaView =
    | typeof MediaViewBulkEdit
    | typeof MediaViewDetail
    | typeof MediaViewFullscreen
    | typeof MediaViewGrid
    | typeof MediaViewMap;

export const MediaViewAll: MediaView[] = [
    MediaViewBulkEdit,
    MediaViewDetail,
    MediaViewFullscreen,
    MediaViewGrid,
    MediaViewMap
];

export type MediaViewOption = KeyValuePair<MediaView>;

export const allMediaViews: MediaViewOption[] = [
    { id: MediaViewBulkEdit, name: "Bulk Edit" },
    { id: MediaViewDetail, name: "Detail" },
    { id: MediaViewFullscreen, name: "Fullscreen" },
    { id: MediaViewGrid, name: "Grid" },
    { id: MediaViewMap, name: "Map" }
];

export const defaultMediaView: MediaView = MediaViewGrid;
