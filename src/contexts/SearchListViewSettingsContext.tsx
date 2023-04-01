import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Margin } from '../models/margin';
import { SearchListViewSettingsState, defaultSearchListViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';
import { KEY_SETTINGS_SEARCH_VIEW_LIST, loadJson, saveJson } from './_storage';

export type SearchListViewSettingsContextValue = [
    state: SearchListViewSettingsState,
    actions: {
        setMargin: (margin: Margin) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
    }
];

const SearchListViewSettingsContext = createContext<SearchListViewSettingsContextValue>([
    defaultSearchListViewSettings,
    {
        setMargin: () => undefined,
        setThumbnailSize: () => undefined
    }
]);

export const SearchListSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: Margin) => updateState({marginId: margin});
    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => updateState({thumbnailSizeId: thumbnailSize});

    const updateState = (update: Partial<SearchListViewSettingsState>) => {
        setState(update);
        saveState(state);
    }

    return (
        <SearchListViewSettingsContext.Provider value={[state, { setMargin, setThumbnailSize }]}>
            {props.children}
        </SearchListViewSettingsContext.Provider>
    );
}

export const useSearchListViewSettings = () => useContext(SearchListViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_SEARCH_VIEW_LIST, defaultSearchListViewSettings);
}

function saveState(state: SearchListViewSettingsState) {
    saveJson(KEY_SETTINGS_SEARCH_VIEW_LIST, state);
}
