import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { PhotoViewMode, PhotoViewModeIdType } from '../models/photo-view-mode';
import { RandomPageSettingsState, defaultRandomPageSettings } from '../models/settings';
import { KEY_SETTINGS_RANDOM_PAGE, loadJson, saveJson } from './_storage';

export type RandomPageSettingsContextValue = [
    state: RandomPageSettingsState,
    actions: {
        setViewMode: (viewMode: PhotoViewModeIdType) => void;
        setSlideshowDisplayDurationSeconds: (slideshowDurationSeconds: number) => void;
    }
];

const RandomPageSettingsContext = createContext<RandomPageSettingsContextValue>([
    defaultRandomPageSettings,
    {
        setViewMode: () => undefined,
        setSlideshowDisplayDurationSeconds: () => undefined
    }
]);

export const RandomPageSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setViewMode = (viewMode: PhotoViewModeIdType) => updateState({viewMode: viewMode});
    const setSlideshowDisplayDurationSeconds = (slideshowDisplayDurationSeconds: number) => updateState({slideshowDisplayDurationSeconds: slideshowDisplayDurationSeconds});

    const updateState = (update: Partial<RandomPageSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <RandomPageSettingsContext.Provider value={[state, { setViewMode, setSlideshowDisplayDurationSeconds }]}>
            {props.children}
        </RandomPageSettingsContext.Provider>
    );
}

export const useRandomPageSettings = () => useContext(RandomPageSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_RANDOM_PAGE, defaultRandomPageSettings);
}

function saveState(state: RandomPageSettingsState) {
    saveJson(KEY_SETTINGS_RANDOM_PAGE, state);
}
