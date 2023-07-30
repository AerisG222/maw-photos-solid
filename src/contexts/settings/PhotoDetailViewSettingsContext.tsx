import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { defaultGridThumbnailSize, ThumbnailSizeIdType } from '../../_models/ThumbnailSize';
import { KEY_SETTINGS_PHOTO_VIEW_DETAIL, loadJson, saveJson } from './_storage';

export type PhotoDetailViewSettingsState = {
    showBreadcrumbs: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    showPhotoList: boolean;
};

export const defaultPhotoDetailViewSettings: PhotoDetailViewSettingsState = {
    showBreadcrumbs: true,
    thumbnailSize: defaultGridThumbnailSize,
    showPhotoList: true,
};

export type PhotoDetailViewSettingsContextValue = [
    state: PhotoDetailViewSettingsState,
    actions: {
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setShowPhotoList: (showPhotoList: boolean) => void;
    }
];

const PhotoDetailViewSettingsContext = createContext<PhotoDetailViewSettingsContextValue>();

export const PhotoDetailSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadPhotoDetailViewSettings());

    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => updateState({showBreadcrumbs: showBreadcrumbs});
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({thumbnailSize: thumbnailSize});
    const setShowPhotoList = (showPhotoList: boolean) => updateState({showPhotoList: showPhotoList});

    const updateState = (update: Partial<PhotoDetailViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <PhotoDetailViewSettingsContext.Provider value={[state, { setShowBreadcrumbs, setShowPhotoList, setThumbnailSize }]}>
            {props.children}
        </PhotoDetailViewSettingsContext.Provider>
    );
};

export const usePhotoDetailViewSettingsContext = () => useContext(PhotoDetailViewSettingsContext);

function loadPhotoDetailViewSettings() {
    return loadJson(KEY_SETTINGS_PHOTO_VIEW_DETAIL, defaultPhotoDetailViewSettings);
}

function saveState(state: PhotoDetailViewSettingsState) {
    saveJson(KEY_SETTINGS_PHOTO_VIEW_DETAIL, state);
}
