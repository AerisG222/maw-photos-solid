import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

export type SearchState = {
    readonly term: string;
};

export const defaultSearchState = {
    term: ""
};

export type SearchContextValue = [
    state: SearchState,
    actions: {
        clearSearchTerm: () => void;
        setSearchTerm: (term: string) => void;
    }
];

const SearchContext = createContext<SearchContextValue>();

export const SearchProvider: ParentComponent = (props) => {
    const [searchState, setSearchState] = createStore(defaultSearchState);

    const clearSearchTerm = () => {
        setSearchTerm("");
    }

    const setSearchTerm = (term: string) => {
        setSearchState({term});
    }

    return <SearchContext.Provider value={[searchState, {
        clearSearchTerm,
        setSearchTerm
    }]}>
        {props.children}
    </SearchContext.Provider>
}

export const useSearchContext = () => useContext(SearchContext);
