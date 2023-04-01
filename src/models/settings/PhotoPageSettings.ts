import { PhotoViewModeIdType, defaultPhotoViewModeId } from '../photo-view-mode';

export type PhotoPageSettingsState = {
    readonly viewModeId: PhotoViewModeIdType;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultPhotoPageSettings: PhotoPageSettingsState = {
    viewModeId: defaultPhotoViewModeId,
    slideshowDisplayDurationSeconds: 2,
};
