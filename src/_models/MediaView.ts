import { KeyValuePair } from "./KeyValuePair";

/*
   The ways of looking at a listing of media.

   Fullscreen is not among them. It used to be a route per area showing one
   photograph with the chrome still around it, and what it actually offered was
   the *absence* of everything else - which is a state the grid can be in rather
   than a place to navigate to. It is a toggle there now, and
   `FullscreenRedirect` keeps the old addresses working.
*/

export const MediaViewBulkEdit = "bulk-edit";
export const MediaViewGrid = "grid";
export const MediaViewMap = "map";

export type MediaView = typeof MediaViewBulkEdit | typeof MediaViewGrid | typeof MediaViewMap;

export const MediaViewAll: MediaView[] = [MediaViewBulkEdit, MediaViewGrid, MediaViewMap];

export type MediaViewOption = KeyValuePair<MediaView>;

export const allMediaViews: MediaViewOption[] = [
    { id: MediaViewBulkEdit, name: "Bulk Edit" },
    { id: MediaViewGrid, name: "Grid" },
    { id: MediaViewMap, name: "Map" }
];

export const defaultMediaView: MediaView = MediaViewGrid;
