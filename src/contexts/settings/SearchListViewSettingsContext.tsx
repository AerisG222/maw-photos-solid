import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { MarginIdType } from '../../_models/Margin';
import { SearchListViewSettingsState, defaultSearchListViewSettings } from '../../_models/settings';
import { ThumbnailSizeIdType } from '../../_models/ThumbnailSize';
import { KEY_SETTINGS_SEARCH_VIEW_LIST, loadJson, saveJson } from './_storage';

export type SearchListViewSettingsContextValue = [
    state: SearchListViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
    }
];

const SearchListViewSettingsContext = createContext<SearchListViewSettingsContextValue>();

export const SearchListSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({margin: margin});
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({thumbnailSize: thumbnailSize});

    const updateState = (update: Partial<SearchListViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <SearchListViewSettingsContext.Provider value={[state, { setMargin, setThumbnailSize }]}>
            {props.children}
        </SearchListViewSettingsContext.Provider>
    );
};

export const useSearchListViewSettingsContext = () => useContext(SearchListViewSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_SEARCH_VIEW_LIST, defaultSearchListViewSettings);
}

function saveState(state: SearchListViewSettingsState) {
    saveJson(KEY_SETTINGS_SEARCH_VIEW_LIST, state);
}
