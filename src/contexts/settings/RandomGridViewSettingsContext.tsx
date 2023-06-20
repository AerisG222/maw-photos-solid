import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MarginIdType } from '../../models/Margin';
import { RandomGridViewSettingsState, defaultRandomGridViewSettings } from '../../models/settings';
import { ThumbnailSizeIdType } from '../../models/ThumbnailSize';
import { KEY_SETTINGS_RANDOM_VIEW_GRID, loadJson, saveJson } from './_storage';

export type RandomGridViewSettingsContextValue = [
    state: RandomGridViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setShowBreadcrumbs: (showBreadcrumbs: boolean) => void;
    }
];

const RandomGridViewSettingsContext = createContext<RandomGridViewSettingsContextValue>([
    defaultRandomGridViewSettings,
    {
        setMargin: () => undefined,
        setThumbnailSize: () => undefined,
        setShowBreadcrumbs: () => undefined
    }
]);

export const RandomGridSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({marginId: margin});
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({thumbnailSize: thumbnailSize});
    const setShowBreadcrumbs = (showBreadcrumbs: boolean) => updateState({showBreadcrumbs: showBreadcrumbs});

    const updateState = (update: Partial<RandomGridViewSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <RandomGridViewSettingsContext.Provider value={[state, { setMargin, setShowBreadcrumbs, setThumbnailSize }]}>
            {props.children}
        </RandomGridViewSettingsContext.Provider>
    );
}

export const useRandomGridViewSettingsContext = () => useContext(RandomGridViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_RANDOM_VIEW_GRID, defaultRandomGridViewSettings);
}

function saveState(state: RandomGridViewSettingsState) {
    saveJson(KEY_SETTINGS_RANDOM_VIEW_GRID, state);
}
