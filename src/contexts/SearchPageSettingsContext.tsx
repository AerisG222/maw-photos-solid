import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { CategoryViewMode } from '../models/category-view-mode';
import { SearchPageSettingsState, defaultSearchPageSettings, loadSearchPageSettings } from '../models/settings';

export type SearchPageSettingsContextValue = [
    state: SearchPageSettingsState,
    actions: {
        setViewMode: (viewMode: CategoryViewMode) => void;
    }
];

const SearchPageSettingsContext = createContext<SearchPageSettingsContextValue>([
    defaultSearchPageSettings,
    {
        setViewMode: () => undefined
    }
]);

export const SearchPageSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadSearchPageSettings());

    const setViewMode = (viewMode: CategoryViewMode) => {
        setState({viewMode: viewMode});
    };

    return (
        <SearchPageSettingsContext.Provider value={[state, { setViewMode }]}>
            {props.children}
        </SearchPageSettingsContext.Provider>
    );
}

export const useSearchPageSettings = () => useContext(SearchPageSettingsContext);
