import { KeyValuePair } from './KeyValuePair';

export type MediaViewModeIdType = string;
export type MediaViewMode = KeyValuePair<MediaViewModeIdType>;

export const allMediaViewModes: MediaViewMode[] = [
    { id: 'bulkEdit',   name: 'Bulk Edit' },
    { id: 'detail',     name: 'Detail' },
    { id: 'fullscreen', name: 'Fullscreen' },
    { id: 'grid',       name: 'Grid' },
    { id: 'map',        name: 'Map' },
];

export const defaultMediaViewMode: MediaViewModeIdType = "grid";
