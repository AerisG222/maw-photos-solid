import { ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { Category } from "../../_models/Category";

export type SearchState = {
    readonly term: string;
    readonly activeTerm: string;
    readonly categories: Category[];
    readonly foundCount: number;
};

export const defaultSearchState = {
    term: "",
    activeTerm: "",
    categories: [],
    foundCount: 0
};

export type SearchContextValue = [
    state: SearchState,
    actions: {
        clearSearchTerm: () => void;
        setSearchTerm: (term: string) => void;
        clearActiveTerm: () => void;
        setActiveTerm: (term: string) => void;
        clearSearchResults: () => void;
        setCategories: (categories: Category[]) => void;
        addCategories: (categories: Category[]) => void;
        setFoundCount: (count: number) => void;
        moreResultsAvailable: () => boolean;
    }
];

const SearchContext = createContext<SearchContextValue>();

export const SearchProvider: ParentComponent = props => {
    const [searchState, setSearchState] = createStore(defaultSearchState);

    const clearSearchTerm = () => {
        setSearchTerm("");
    };

    const setSearchTerm = (term: string) => {
        setSearchState({ term });
    };

    const clearActiveTerm = () => {
        setActiveTerm("");
    };

    const setActiveTerm = (activeTerm: string) => {
        setSearchState({ activeTerm });
    };

    const clearSearchResults = () => {
        setSearchState({
            activeTerm: "",
            categories: [],
            foundCount: 0
        });
    };

    const setCategories = (categories: Category[]) => {
        setSearchState({ categories });
    };

    const addCategories = (categories: Category[]) => {
        if (categories) {
            setSearchState(s => ({ categories: [...s.categories, ...categories] }));
        }
    };

    const setFoundCount = (count: number) => setSearchState({ foundCount: count });

    const moreResultsAvailable = () => searchState.categories.length < searchState.foundCount;

    return (
        <SearchContext.Provider
            value={[
                searchState,
                {
                    clearSearchTerm,
                    setSearchTerm,
                    clearActiveTerm,
                    setActiveTerm,
                    clearSearchResults,
                    setCategories,
                    addCategories,
                    setFoundCount,
                    moreResultsAvailable
                }
            ]}
        >
            {props.children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const ctx = useContext(SearchContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("Search context not provided by ancestor component!");
};
