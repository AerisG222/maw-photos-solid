import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { PhotoViewModeIdType } from '../models/PhotoViewMode';
import { PhotoPageSettingsState, defaultPhotoPageSettings } from '../models/settings';
import { KEY_SETTINGS_PHOTO_PAGE, loadJson, saveJson } from './_storage';

export type PhotoPageSettingsContextValue = [
    state: PhotoPageSettingsState,
    actions: {
        setViewMode: (viewMode: PhotoViewModeIdType) => void;
        setSlideshowDisplayDurationSeconds: (slideshowDurationSeconds: number) => void;
    }
];

const PhotoPageSettingsContext = createContext<PhotoPageSettingsContextValue>([
    defaultPhotoPageSettings,
    {
        setViewMode: () => undefined,
        setSlideshowDisplayDurationSeconds: () => undefined
    }
]);

export const PhotoPageSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setViewMode = (viewMode: PhotoViewModeIdType) => updateState({viewMode: viewMode});
    const setSlideshowDisplayDurationSeconds = (slideshowDisplayDurationSeconds: number) => updateState({slideshowDisplayDurationSeconds: slideshowDisplayDurationSeconds});

    const updateState = (update: Partial<PhotoPageSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <PhotoPageSettingsContext.Provider value={[state, { setViewMode, setSlideshowDisplayDurationSeconds }]}>
            {props.children}
        </PhotoPageSettingsContext.Provider>
    );
}

export const usePhotoPageSettingsContext = () => useContext(PhotoPageSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_PHOTO_PAGE, defaultPhotoPageSettings);
}

function saveState(state: PhotoPageSettingsState) {
    saveJson(KEY_SETTINGS_PHOTO_PAGE, state);
}
