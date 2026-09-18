import { Accessor, ParentComponent, createContext, createSignal, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { UseInfiniteQueryResult, InfiniteData, UseMutationResult } from "@tanstack/solid-query";
import { Category } from "../../_models/Category";
import { SearchResults } from "../../_models/SearchResults";
import { IsFavoriteRequest } from "../../_models/IsFavoriteRequest";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";
import { KEY_UI_RECENT_SEARCHES, loadJson } from "../../_contexts/settings/_storage";
import { rememberSearch } from "../_recentSearches";

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
        recentSearches: Accessor<readonly string[]>;
        removeRecentSearch: (term: string) => void;
        clearRecentSearches: () => void;
        categorySearchQuery: (
            query: Accessor<string>
        ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Category> | undefined>, Error>;
        allSearchResults: (
            searchQuery: UseInfiniteQueryResult<
                InfiniteData<SearchResults<Category> | undefined>,
                Error
            >
        ) => Category[];
        setIsFavoriteMutation: UseMutationResult<
            Response,
            Error,
            IsFavoriteRequest<Category>,
            unknown
        >;
    }
];

const SearchContext = createContext<SearchContextValue>();

export const SearchProvider: ParentComponent = props => {
    const [searchState, setSearchState] = createStore(defaultSearchState);
    const { categorySearchQuery, setIsFavoriteMutation } = useCategoriesContext();
    const [area] = useAreaSettingsContext();
    const [recent, setRecent] = createSignal<readonly string[]>(
        loadJson<string[]>(KEY_UI_RECENT_SEARCHES, [])
    );

    // sliced on the way out too, so lowering the setting shortens the list at once
    const recentSearches = () => recent().slice(0, area.searchHistoryCount);

    const saveRecent = (terms: readonly string[]) => {
        setRecent(terms);

        if (terms.length > 0) {
            localStorage.setItem(KEY_UI_RECENT_SEARCHES, JSON.stringify(terms));
        } else {
            localStorage.removeItem(KEY_UI_RECENT_SEARCHES);
        }
    };

    // exact rather than case-blind: the list already holds each term only once
    const removeRecentSearch = (term: string) =>
        saveRecent(recent().filter(other => other !== term));

    const clearRecentSearches = () => saveRecent([]);

    const clearSearchTerm = () => {
        setSearchTerm("");
    };

    const setSearchTerm = (term: string) => {
        setSearchState({ term });
    };

    const clearActiveTerm = () => {
        setActiveTerm("");
    };

    // every search that runs goes through here, so this is where one is remembered
    const setActiveTerm = (activeTerm: string) => {
        setSearchState({ activeTerm });

        if (activeTerm.trim()) {
            saveRecent(rememberSearch(recent(), activeTerm, area.searchHistoryCount));
        }
    };

    const allSearchResults = (
        searchQuery: UseInfiniteQueryResult<
            InfiniteData<SearchResults<Category> | undefined>,
            Error
        >
    ) => {
        const cats: Category[] = [];

        if (searchQuery.isSuccess) {
            for (const page of searchQuery.data?.pages ?? []) {
                if (page) {
                    cats.push(...page.results);
                }
            }
        }

        return cats;
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
                    recentSearches,
                    removeRecentSearch,
                    clearRecentSearches,
                    categorySearchQuery,
                    allSearchResults,
                    setIsFavoriteMutation
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
