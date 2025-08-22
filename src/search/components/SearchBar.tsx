import { Component } from "solid-js";

import { useSearchContext } from "../contexts/SearchContext";

const SearchBar: Component = () => {
    const [searchContext, { setSearchTerm, setActiveTerm }] = useSearchContext();

    return (
        <div class="flex flex-row justify-center">
            <input
                type="text"
                placeholder="Search Terms"
                class="input input-bordered input-md w-[400px]"
                value={searchContext.term}
                onKeyDown={evt => evt.stopPropagation()}
                onChange={evt => setSearchTerm(evt.currentTarget.value)}
            />

            <button
                class="ml-2 btn btn-primary btn-outline hover:bg-secondary hover:text-secondary-content"
                title="Search"
                onClick={() => setActiveTerm(searchContext.term)}
            >
                <span class="text-6 icon-[ic--round-search]" />
            </button>

            <button
                class="ml-6 btn btn-error btn-outline hover:bg-secondary hover:text-secondary-content"
                title="Cancel"
                onClick={() => {
                    setSearchTerm("");
                    setActiveTerm("");
                }}
            >
                <span class="text-6 icon-[ic--round-close]" />
            </button>
        </div>
    );
};

export default SearchBar;
