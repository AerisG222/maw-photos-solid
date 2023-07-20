import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useCategoryContext } from '../../contexts/CategoryContext';

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
        executeSearch: () => void;
    }
];

const SearchContext = createContext<SearchContextValue>();

export const SearchProvider: ParentComponent = (props) => {
    const [searchState, setSearchState] = createStore(defaultSearchState);
    const [categoryContext] = useCategoryContext();

    const clearSearchTerm = () => {
        setSearchTerm("");
    }

    const setSearchTerm = (term: string) => {
        setSearchState({term});
    }

    const executeSearch = () => {
        console.log(searchState.term);
        console.log(categoryContext.categories);
    }

    return <SearchContext.Provider value={[searchState, {
        clearSearchTerm,
        setSearchTerm,
        executeSearch
    }]}>
        {props.children}
    </SearchContext.Provider>
}

export const useSearchContext = () => useContext(SearchContext);
