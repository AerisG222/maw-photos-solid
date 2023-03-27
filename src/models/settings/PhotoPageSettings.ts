import { PhotoViewMode } from '../photo-view-mode';

export type PhotoPageSettingsState = {
    readonly viewMode: PhotoViewMode;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultPhotoPageSettings: PhotoPageSettingsState = {
    viewMode: PhotoViewMode.grid,
    slideshowDisplayDurationSeconds: 2,
};
