import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { defaultPhotoViewMode, PhotoViewModeIdType } from '../../_models/PhotoViewMode';
import { KEY_SETTINGS_PHOTO_PAGE, loadJson, saveJson } from './_storage';

export type PhotoPageSettingsState = {
    readonly viewMode: PhotoViewModeIdType;
    readonly slideshowDisplayDurationSeconds: number;
};

export const defaultPhotoPageSettings: PhotoPageSettingsState = {
    viewMode: defaultPhotoViewMode,
    slideshowDisplayDurationSeconds: 2,
};

export type PhotoPageSettingsContextValue = [
    state: PhotoPageSettingsState,
    actions: {
        setViewMode: (viewMode: PhotoViewModeIdType) => void;
        setSlideshowDisplayDurationSeconds: (slideshowDurationSeconds: number) => void;
    }
];

const PhotoPageSettingsContext = createContext<PhotoPageSettingsContextValue>();

export const PhotoPageSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setViewMode = (viewMode: PhotoViewModeIdType) => updateState({viewMode: viewMode});
    const setSlideshowDisplayDurationSeconds = (slideshowDisplayDurationSeconds: number) => updateState({slideshowDisplayDurationSeconds: slideshowDisplayDurationSeconds});

    const updateState = (update: Partial<PhotoPageSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <PhotoPageSettingsContext.Provider value={[state, { setViewMode, setSlideshowDisplayDurationSeconds }]}>
            {props.children}
        </PhotoPageSettingsContext.Provider>
    );
};

export const usePhotoPageSettingsContext = () => useContext(PhotoPageSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_PHOTO_PAGE, defaultPhotoPageSettings);
}

function saveState(state: PhotoPageSettingsState) {
    saveJson(KEY_SETTINGS_PHOTO_PAGE, state);
}
