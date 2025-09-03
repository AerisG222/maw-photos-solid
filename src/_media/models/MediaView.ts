export const MediaViewModeBulkEdit = "bulk-edit";
export const MediaViewModeDetail = "detail";
export const MediaViewModeFullscreen = "fullscreen";
export const MediaViewModeGrid = "grid";
export const MediaViewModeMap = "map";

export type MediaView =
    | typeof MediaViewModeBulkEdit
    | typeof MediaViewModeDetail
    | typeof MediaViewModeFullscreen
    | typeof MediaViewModeGrid
    | typeof MediaViewModeMap;

export const MediaViewAll: MediaView[] = [
    MediaViewModeBulkEdit,
    MediaViewModeDetail,
    MediaViewModeFullscreen,
    MediaViewModeGrid,
    MediaViewModeMap
];
