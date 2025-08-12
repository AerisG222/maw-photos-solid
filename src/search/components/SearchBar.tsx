import { Component, batch, createEffect, createResource, createSignal } from "solid-js";

import { useSearchContext } from "../contexts/SearchContext";
import { searchCategories } from "../../_api/Search";

const SearchBar: Component = () => {
    const [searchContext, { setSearchTerm, clearSearchTerm, setActiveTerm, setCategories, clearSearchResults, setFoundCount }] = useSearchContext();
    const [execute, setExecute] = createSignal(false);

    const executeSearch = () => {
        if(searchContext.term !== searchContext.activeTerm) {
            setActiveTerm(searchContext.term);

            return searchCategories(searchContext.term, 0);
        }

        return undefined;
    }

    const [searchResource] = createResource(execute, executeSearch);

    const onSearch = () => {
        if(!searchContext.term) {
            clearSearchResults();
        } else {
            setExecute(true);
        }
    }

    const onClearSearch = () => {
        clearSearchTerm();
        clearSearchResults();
    }

    createEffect(() => {
        if(searchResource.state === "ready" && searchResource()) {
            batch(() => {
                setCategories(searchResource().results);
                setFoundCount(searchResource().totalFound);
                setExecute(false);
            })
        }
    });

    return (
        <div class="flex flex-row justify-center">
            <input
                type="text"
                placeholder="Search Terms"
                class="input input-bordered input-md w-[400px]"
                value={searchContext.term}
                onKeyDown={evt => evt.stopPropagation() }
                onChange={evt => setSearchTerm(evt.currentTarget.value)} />

            <button
                class="ml-2 btn btn-primary btn-outline hover:bg-secondary hover:text-secondary-content"
                title="Search"
                onClick={onSearch}
            >
                <span class="text-6 icon-[ic--round-search]" />
            </button>

            <button
                class="ml-6 btn btn-error btn-outline hover:bg-secondary hover:text-secondary-content"
                title="Cancel"
                onClick={onClearSearch}
            >
                <span class="text-6 icon-[ic--round-close]" />
            </button>
        </div>
    )
};

export default SearchBar;
