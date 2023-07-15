import { PhotoViewModeIdType, defaultPhotoViewMode } from '../PhotoViewMode';

export type PhotoPageSettingsState = {
    readonly viewMode: PhotoViewModeIdType;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultPhotoPageSettings: PhotoPageSettingsState = {
    viewMode: defaultPhotoViewMode,
    slideshowDisplayDurationSeconds: 2,
};
