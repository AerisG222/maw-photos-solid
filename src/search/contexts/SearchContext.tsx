import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Category } from '../../_models/Category';

export type SearchState = {
    readonly term: string;
    readonly categories: Category[];
};

export const defaultSearchState = {
    term: "",
    categories: []
};

export type SearchContextValue = [
    state: SearchState,
    actions: {
        clearSearchTerm: () => void;
        setSearchTerm: (term: string) => void;
        clearCategories: () => void;
        setCategories: (categories: Category[]) => void;
        addCategories: (categories: Category[]) => void;
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

    const clearCategories = () => {
        setSearchState({ categories: [] });
    };

    const setCategories = (categories: Category[]) => {
        setSearchState({ categories });
    };

    const addCategories = (categories: Category[]) => {
        if(categories) {
            setSearchState(s => ({ categories: [...s.categories, ...categories] }));
        }
    };

    return <SearchContext.Provider value={[searchState, {
        clearSearchTerm,
        setSearchTerm,
        clearCategories,
        setCategories,
        addCategories
    }]}>
        {props.children}
    </SearchContext.Provider>
}

export const useSearchContext = () => useContext(SearchContext);
