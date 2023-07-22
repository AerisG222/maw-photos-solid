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

    createEffect(() => {
        if(searchResource.state === "ready") {
            setCategories(searchResource().results);
        }
    });

    return (
        <div class="flex flex-row">
            <input
                type="text"
                placeholder="Search Terms"
                class="input input-bordered w-full mr-4"
                value={searchContext.term}
                onChange={evt => setSearchTerm(evt.currentTarget.value)} />

            <button
                class="hover:bg-accent hover:color-accentContent disabled:bg-transparent! disabled:color-secondary-content disabled:opacity-20"
                title="Search"
                onClick={onSearch}
            >
                <div>
                    <span class="text-6 i-ic-round-search" /> Search
                </div>
            </button>
        </div>
    )
};

export default SearchBar;
