import { PhotoViewModeIdType, defaultPhotoViewMode } from '../PhotoViewMode';

export type RandomPageSettingsState = {
    readonly viewMode: PhotoViewModeIdType;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultRandomPageSettings: RandomPageSettingsState = {
    viewMode: defaultPhotoViewMode,
    slideshowDisplayDurationSeconds: 2,
};
