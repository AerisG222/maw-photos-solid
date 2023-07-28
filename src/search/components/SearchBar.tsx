import { Component, batch, createEffect, createResource, createSignal } from 'solid-js';

import { useSearchContext } from '../contexts/SearchContext';
import { searchCategories } from '../../_api/Search';

const SearchBar: Component = () => {
    const [searchContext, { setSearchTerm, clearSearchTerm, setActiveTerm, clearActiveTerm, setCategories, clearSearchResults, setFoundCount }] = useSearchContext();
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
                class="ml-2 btn btn-outline hover:bg-accent hover:color-accentContent"
                title="Search"
                onClick={onSearch}
            >
                <span class="text-6 i-ic-round-search" />
            </button>

            <button
                class="ml-12 btn btn-warning btn-outline hover:bg-accent hover:color-accentContent"
                title="Cancel"
                onClick={onClearSearch}
            >
                <span class="text-6 i-ic-round-close" />
            </button>
        </div>
    )
};

export default SearchBar;
