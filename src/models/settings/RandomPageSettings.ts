import { PhotoViewMode } from '../photo-view-mode';

export type RandomPageSettingsState = {
    readonly viewMode: PhotoViewMode;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultRandomPageSettings: RandomPageSettingsState = {
    viewMode: PhotoViewMode.grid,
    slideshowDisplayDurationSeconds: 2,
};
