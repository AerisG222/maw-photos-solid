import { PhotoViewModeIdType, defaultPhotoViewModeId } from '../photo-view-mode';

export type RandomPageSettingsState = {
    readonly viewModeId: PhotoViewModeIdType;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultRandomPageSettings: RandomPageSettingsState = {
    viewModeId: defaultPhotoViewModeId,
    slideshowDisplayDurationSeconds: 2,
};
