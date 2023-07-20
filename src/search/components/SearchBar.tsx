import { Component } from 'solid-js';
import { useSearchContext } from '../contexts/SearchContext';

const SearchBar: Component = () => {
    const [searchContext, { setSearchTerm, executeSearch }] = useSearchContext();

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
                onClick={executeSearch}
            >
                <div>
                    <span class="text-6 i-ic-round-search" /> Search
                </div>
            </button>
        </div>
    )
};

export default SearchBar;
