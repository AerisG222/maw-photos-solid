import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MarginIdType } from '../models/margin';
import { SearchListViewSettingsState, defaultSearchListViewSettings } from '../models/settings';
import { ThumbnailSizeIdType } from '../models/thumbnail-size';
import { KEY_SETTINGS_SEARCH_VIEW_LIST, loadJson, saveJson } from './_storage';

export type SearchListViewSettingsContextValue = [
    state: SearchListViewSettingsState,
    actions: {
        setMargin: (marginId: MarginIdType) => void;
        setThumbnailSize: (thumbnailSizeId: ThumbnailSizeIdType) => void;
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

    const setMargin = (marginId: MarginIdType) => updateState({marginId: marginId});
    const setThumbnailSize = (thumbnailSizeId: ThumbnailSizeIdType) => updateState({thumbnailSizeId: thumbnailSizeId});

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
