import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MarginIdType } from '../../_models/Margin';
import { PhotoGridViewSettingsState, defaultPhotoGridViewSettings } from '../../_models/settings';
import { ThumbnailSizeIdType } from '../../_models/ThumbnailSize';
import { KEY_SETTINGS_PHOTO_VIEW_GRID, loadJson, saveJson } from './_storage';

export type PhotoGridViewSettingsContextValue = [
    state: PhotoGridViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setShowMainBreadcrumbs: (showBreadcrumbs: boolean) => void;
    }
];

const PhotoGridViewSettingsContext = createContext<PhotoGridViewSettingsContextValue>();

export const PhotoGridSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({margin: margin});
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({thumbnailSize: thumbnailSize});
    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => updateState({showBreadcrumbs: showBreadcrumbs});
    const setShowMainBreadcrumbs = (showBreadcrumbs: boolean) => updateState({showMainBreadcrumbs: showBreadcrumbs});

    const updateState = (update: Partial<PhotoGridViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <PhotoGridViewSettingsContext.Provider value={[state, {
            setMargin,
            setShowBreadcrumbs,
            setShowMainBreadcrumbs,
            setThumbnailSize
        }]}>
            {props.children}
        </PhotoGridViewSettingsContext.Provider>
    );
};

export const usePhotoGridViewSettingsContext = () => useContext(PhotoGridViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_PHOTO_VIEW_GRID, defaultPhotoGridViewSettings);
}

function saveState(state: PhotoGridViewSettingsState) {
    saveJson(KEY_SETTINGS_PHOTO_VIEW_GRID, state);
}
