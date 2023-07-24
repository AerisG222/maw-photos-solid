import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Category } from '../../_models/Category';

export type SearchState = {
    readonly term: string;
    readonly categories: Category[];
    readonly foundCount: number;
};

export const defaultSearchState = {
    term: "",
    categories: [],
    foundCount: 0
};

export type SearchContextValue = [
    state: SearchState,
    actions: {
        clearSearchTerm: () => void;
        setSearchTerm: (term: string) => void;
        clearCategories: () => void;
        setCategories: (categories: Category[]) => void;
        addCategories: (categories: Category[]) => void;
        setFoundCount: (count: number) => void;
        moreResultsAvailable: () => boolean;
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

    const setFoundCount = (count: number) => setSearchState({ foundCount: count });

    const moreResultsAvailable = () => searchState.categories.length < searchState.foundCount;

    return <SearchContext.Provider value={[searchState, {
        clearSearchTerm,
        setSearchTerm,
        clearCategories,
        setCategories,
        addCategories,
        setFoundCount,
        moreResultsAvailable
    }]}>
        {props.children}
    </SearchContext.Provider>
}

export const useSearchContext = () => useContext(SearchContext);
