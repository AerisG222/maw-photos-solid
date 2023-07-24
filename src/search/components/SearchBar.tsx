import { Component, createEffect, createResource, createSignal } from 'solid-js';

import { useSearchContext } from '../contexts/SearchContext';
import { useCategoryContext } from '../../contexts/CategoryContext';
import { searchCategories } from '../../_api/Search';

const SearchBar: Component = () => {
    const [searchContext, { setSearchTerm }] = useSearchContext();
    const [, { setCategories, clearCategories }] = useCategoryContext();
    const [term, setTerm] = createSignal("");

    const executeSearch = () => {
        if(searchContext.term) {
            return searchCategories(searchContext.term, 0);
        }

        return {
            results: [],
            totalFound: 0,
            startIndex: 0
        };
    }

    const [searchResource] = createResource(term, executeSearch);

    const onSearch = () => {
        if(!searchContext.term) {
            clearCategories();
        } else {
            setTerm(searchContext.term);
        }
    }

    const onClearSearch = () => {
        setSearchTerm("");
        clearCategories();
    }

    createEffect(() => {
        if(searchResource.state === "ready") {
            setCategories(searchResource().results);
        }
    });

    return (
        <div class="flex flex-row justify-center">
            <input
                type="text"
                placeholder="Search Terms"
                class="input input-bordered input-md w-[400px]"
                value={searchContext.term}
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
