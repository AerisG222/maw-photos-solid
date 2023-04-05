import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { CategoryViewModeIdType } from '../models/CategoryViewMode';
import { SearchPageSettingsState, defaultSearchPageSettings } from '../models/settings';
import { KEY_SETTINGS_SEARCH_PAGE, loadJson, saveJson } from './_storage';

export type SearchPageSettingsContextValue = [
    state: SearchPageSettingsState,
    actions: {
        setViewMode: (viewMode: CategoryViewModeIdType) => void;
    }
];

const SearchPageSettingsContext = createContext<SearchPageSettingsContextValue>([
    defaultSearchPageSettings,
    {
        setViewMode: () => undefined
    }
]);

export const SearchPageSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadState());

    const setViewMode = (viewMode: CategoryViewModeIdType) => {
        setState({viewMode: viewMode});
        saveState(state);
    };

    return (
        <SearchPageSettingsContext.Provider value={[state, { setViewMode }]}>
            {props.children}
        </SearchPageSettingsContext.Provider>
    );
}

export const useSearchPageSettings = () => useContext(SearchPageSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_SEARCH_PAGE, defaultSearchPageSettings);
}

function saveState(state: SearchPageSettingsState) {
    saveJson(KEY_SETTINGS_SEARCH_PAGE, state);
}
