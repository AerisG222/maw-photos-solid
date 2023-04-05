import { KeyValuePair } from './KeyValuePair';

export type PhotoViewModeIdType = string;
export type PhotoViewMode = KeyValuePair<PhotoViewModeIdType>;

export const allPhotoViewModes: PhotoViewMode[] = [
    { id: 'bulkEdit',   name: 'Bulk Edit' },
    { id: 'detail',     name: 'Detail' },
    { id: 'fullscreen', name: 'Fullscreen' },
    { id: 'grid',       name: 'Grid' },
    { id: 'map',        name: 'Map' },
];

export const allRandomViewModes: PhotoViewMode[] = [
    { id: 'detail',     name: 'Detail' },
    { id: 'fullscreen', name: 'Fullscreen' },
    { id: 'grid',       name: 'Grid' },
];

export const defaultPhotoViewMode: PhotoViewModeIdType = "grid";
export const defaultRandomViewMode: PhotoViewModeIdType = "grid";
