import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { CategoryViewModeIdType, defaultCategoryViewMode } from "../../_models/CategoryViewMode";
import { KEY_SETTINGS_SEARCH_PAGE, loadJson, saveJson } from "./_storage";

export type SearchPageSettingsState = {
    readonly viewMode: CategoryViewModeIdType;
};

export const defaultSearchPageSettings: SearchPageSettingsState = {
    viewMode: defaultCategoryViewMode,
};


export type SearchPageSettingsContextValue = [
    state: SearchPageSettingsState,
    actions: {
        setViewMode: (viewMode: CategoryViewModeIdType) => void;
    }
];

const SearchPageSettingsContext = createContext<SearchPageSettingsContextValue>();

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
};

export const useSearchPageSettingsContext = () => useContext(SearchPageSettingsContext);

function loadState() {
    return loadJson(KEY_SETTINGS_SEARCH_PAGE, defaultSearchPageSettings);
}

function saveState(state: SearchPageSettingsState) {
    saveJson(KEY_SETTINGS_SEARCH_PAGE, state);
}
