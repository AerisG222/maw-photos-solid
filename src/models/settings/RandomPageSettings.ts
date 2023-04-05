import { PhotoViewModeIdType, defaultPhotoViewMode } from '../photo-view-mode';

export type RandomPageSettingsState = {
    readonly viewMode: PhotoViewModeIdType;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultRandomPageSettings: RandomPageSettingsState = {
    viewMode: defaultPhotoViewMode,
    slideshowDisplayDurationSeconds: 2,
};
