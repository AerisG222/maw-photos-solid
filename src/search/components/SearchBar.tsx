import { Component } from "solid-js";

import { useSearchContext } from "../contexts/SearchContext";

const SearchBar: Component = () => {
    const [searchContext, { setSearchTerm, setActiveTerm }] = useSearchContext();

    const executeSearch = () => {
        setActiveTerm(searchContext.term);
    };

    const keyDown = (evt: KeyboardEvent) => {
        if (evt.key === "Enter") {
            executeSearch();
        }

        evt.stopPropagation();
    };

    return (
        <div class="flex flex-row justify-center">
            <input
                type="text"
                placeholder="Search Terms"
                class="input input-bordered input-md w-[400px]"
                value={searchContext.term}
                onKeyDown={keyDown}
                onInput={evt => setSearchTerm(evt.currentTarget.value)}
            />

            <button
                class="ml-3 btn btn-primary btn-outline hover:bg-primary hover:text-primary-content"
                title="Search"
                onClick={executeSearch}
            >
                <span class="text-6 icon-[ic--round-search]" />
            </button>

            <button
                class="ml-3 btn btn-error btn-outline hover:bg-error hover:text-error-content"
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
