import { PhotoViewModeIdType, defaultPhotoViewMode } from '../photo-view-mode';

export type PhotoPageSettingsState = {
    readonly viewMode: PhotoViewModeIdType;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultPhotoPageSettings: PhotoPageSettingsState = {
    viewMode: defaultPhotoViewMode,
    slideshowDisplayDurationSeconds: 2,
};
