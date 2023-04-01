import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Margin } from '../models/margin';
import { PhotoGridViewSettingsState, defaultPhotoGridViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';
import { KEY_SETTINGS_PHOTO_VIEW_GRID, loadJson, saveJson } from './_storage';

export type PhotoGridViewSettingsContextValue = [
    state: PhotoGridViewSettingsState,
    actions: {
        setMargin: (margin: Margin) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
    }
];

const PhotoGridViewSettingsContext = createContext<PhotoGridViewSettingsContextValue>([
    defaultPhotoGridViewSettings,
    {
        setMargin: () => undefined,
        setThumbnailSize: () => undefined,
        setShowBreadcrumbs: () => undefined
    }
]);

export const PhotoGridSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: Margin) => updateState({marginId: margin});
    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => updateState({thumbnailSize: thumbnailSize});
    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => updateState({showBreadcrumbs: showBreadcrumbs});

    const updateState = (update: Partial<PhotoGridViewSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <PhotoGridViewSettingsContext.Provider value={[state, { setMargin, setShowBreadcrumbs, setThumbnailSize }]}>
            {props.children}
        </PhotoGridViewSettingsContext.Provider>
    );
}

export const usePhotoGridViewSettings = () => useContext(PhotoGridViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_PHOTO_VIEW_GRID, defaultPhotoGridViewSettings);
}

function saveState(state: PhotoGridViewSettingsState) {
    saveJson(KEY_SETTINGS_PHOTO_VIEW_GRID, state);
}
