import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Margin } from '../models/margin';
import { SearchGridViewSettingsState, defaultSearchGridViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';
import { KEY_SETTINGS_SEARCH_VIEW_GRID, loadJson, saveJson } from './_storage';

export type SearchGridViewSettingsContextValue = [
    state: SearchGridViewSettingsState,
    actions: {
        setMargin: (margin: Margin) => void;
        setShowTitles: (showTitles: boolean) => void;
        setShowYears: (showYears: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
    }
];

const SearchGridViewSettingsContext = createContext<SearchGridViewSettingsContextValue>([
    defaultSearchGridViewSettings,
    {
        setMargin: () => undefined,
        setShowTitles: () => undefined,
        setShowYears: () => undefined,
        setThumbnailSize: () => undefined
    }
]);

export const SearchGridSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: Margin) => updateState({margin: margin});
    const setShowTitles = (showTitles: boolean) => updateState({showTitles: showTitles});
    const setShowYears = (showYears: boolean) => updateState({showTitles: showYears});
    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => updateState({thumbnailSize: thumbnailSize});

    const updateState = (update: Partial<SearchGridViewSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <SearchGridViewSettingsContext.Provider value={[state, { setMargin, setShowTitles, setShowYears, setThumbnailSize }]}>
            {props.children}
        </SearchGridViewSettingsContext.Provider>
    );
}

export const useSearchGridViewSettings = () => useContext(SearchGridViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_SEARCH_VIEW_GRID, defaultSearchGridViewSettings);
}

function saveState(state: SearchGridViewSettingsState) {
    saveJson(KEY_SETTINGS_SEARCH_VIEW_GRID, state);
}
