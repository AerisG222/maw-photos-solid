import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MarginIdType } from '../models/Margin';
import { SearchGridViewSettingsState, defaultSearchGridViewSettings } from '../models/settings';
import { ThumbnailSizeIdType } from '../models/ThumbnailSize';
import { KEY_SETTINGS_SEARCH_VIEW_GRID, loadJson, saveJson } from './_storage';

export type SearchGridViewSettingsContextValue = [
    state: SearchGridViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setShowTitles: (showTitles: boolean) => void;
        setShowYears: (showYears: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
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

    const setMargin = (margin: MarginIdType) => updateState({margin: margin});
    const setShowTitles = (showTitles: boolean) => updateState({showTitles: showTitles});
    const setShowYears = (showYears: boolean) => updateState({showTitles: showYears});
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({thumbnailSize: thumbnailSize});

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

export const useSearchGridViewSettingsContext = () => useContext(SearchGridViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_SEARCH_VIEW_GRID, defaultSearchGridViewSettings);
}

function saveState(state: SearchGridViewSettingsState) {
    saveJson(KEY_SETTINGS_SEARCH_VIEW_GRID, state);
}
