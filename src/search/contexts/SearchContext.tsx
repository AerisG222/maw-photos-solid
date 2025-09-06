import { ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { UseInfiniteQueryResult, InfiniteData } from "@tanstack/solid-query";
import { Category } from "../../_models/Category";
import { SearchResults } from "../../_models/SearchResults";

export interface SearchState {
    readonly term: string;
    readonly activeTerm: string;
}

export const defaultSearchState = {
    term: "",
    activeTerm: ""
};

export type SearchContextValue = [
    state: SearchState,
    actions: {
        clearSearchTerm: () => void;
        setSearchTerm: (term: string) => void;
        clearActiveTerm: () => void;
        setActiveTerm: (term: string) => void;
        categorySearchQuery: (
            query: string
        ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Category> | undefined>, Error>;
    }
];

const SearchContext = createContext<SearchContextValue>();

export const SearchProvider: ParentComponent = props => {
    const [searchState, setSearchState] = createStore(defaultSearchState);
    const { categorySearchQuery } = useCategoriesContext();

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

    return (
        <SearchContext.Provider
            value={[
                searchState,
                {
                    clearSearchTerm,
                    setSearchTerm,
                    clearActiveTerm,
                    setActiveTerm,
                    categorySearchQuery
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
