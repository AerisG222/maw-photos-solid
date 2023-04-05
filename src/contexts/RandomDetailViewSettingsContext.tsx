import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { RandomDetailViewSettingsState, defaultRandomDetailViewSettings } from '../models/settings';
import { ThumbnailSizeIdType } from '../models/thumbnail-size';
import { KEY_SETTINGS_RANDOM_VIEW_DETAIL, loadJson, saveJson } from './_storage';

export type RandomDetailViewSettingsContextValue = [
    state: RandomDetailViewSettingsState,
    actions: {
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setShowPhotoList: (showPhotoList: boolean) => void;
    }
];

const RandomDetailViewSettingsContext = createContext<RandomDetailViewSettingsContextValue>([
    defaultRandomDetailViewSettings,
    {
        setShowBreadcrumbs: () => undefined,
        setThumbnailSize: () => undefined,
        setShowPhotoList: () => undefined
    }
]);

export const RandomDetailSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => updateState({showBreadcrumbs: showBreadcrumbs});
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({thumbnailSize: thumbnailSize});
    const setShowPhotoList = (showPhotoList: boolean) => updateState({showPhotoList: showPhotoList});

    const updateState = (update: Partial<RandomDetailViewSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <RandomDetailViewSettingsContext.Provider value={[state, { setShowBreadcrumbs, setShowPhotoList, setThumbnailSize }]}>
            {props.children}
        </RandomDetailViewSettingsContext.Provider>
    );
}

export const useRandomDetailViewSettings = () => useContext(RandomDetailViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_RANDOM_VIEW_DETAIL, defaultRandomDetailViewSettings);
}

function saveState(state: RandomDetailViewSettingsState) {
    saveJson(KEY_SETTINGS_RANDOM_VIEW_DETAIL, state);
}
